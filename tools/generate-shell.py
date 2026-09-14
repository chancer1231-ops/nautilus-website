"""Generate the Nautilus shell SVG used in the Philosophy section of index.html.

Golden-rectangle construction, the logarithmic golden spiral through its corners, and
chamber walls (septa). Timing lives in data-t (start, seconds) and data-d (duration,
seconds); js/main.js turns those into one looping Web Animations timeline.

Optional tooling: the site has no build step and does not need this to run. Use it only
to change the drawing or its timing, then paste the output over the <svg class="shell">
block in index.html.

    python3 tools/generate-shell.py > /tmp/shell.svg

Standard library only. Colours are not set here; they come from css/styles.css.
"""
import math

PHI = (1 + 5 ** 0.5) / 2
VB_W, VB_H = 400, 600
H = 500.0
W = H / PHI                      # portrait golden rectangle
X0, Y0 = (VB_W - W) / 2, (VB_H - H) / 2

# ---- square subdivision (cut order for a portrait rectangle: top, right, bottom, left) ----
def subdivide(x, y, w, h, n=11):
    squares, starts = [], []
    order = ["top", "right", "bottom", "left"]
    px, py = x, y                        # spiral starts at the outer top-left corner
    for k in range(n):
        side = order[k % 4]
        if side == "top":
            s = w; sq = (x, y, s); x, y, w, h = x, y + s, w, h - s
        elif side == "right":
            s = h; sq = (x + w - s, y, s); w = w - s
        elif side == "bottom":
            s = w; sq = (x, y + h - s, s); h = h - s
        else:
            s = h; sq = (x, y, s); x, w = x + s, w - s
        squares.append(sq)
        sx, sy, ss = sq
        corners = [(sx, sy), (sx + ss, sy), (sx + ss, sy + ss), (sx, sy + ss)]
        # the spiral enters at (px,py) and leaves at the opposite corner
        i = min(range(4), key=lambda j: math.dist(corners[j], (px, py)))
        starts.append(corners[i])
        px, py = corners[(i + 2) % 4]
    return squares, starts

squares, S = subdivide(X0, Y0, W, H)

def intersect(p1, p2, p3, p4):
    x1, y1 = p1; x2, y2 = p2; x3, y3 = p3; x4, y4 = p4
    d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    a = x1 * y2 - y1 * x2; b = x3 * y4 - y3 * x4
    return ((a * (x3 - x4) - (x1 - x2) * b) / d, (a * (y3 - y4) - (y1 - y2) * b) / d)

POLE = intersect(S[0], S[2], S[1], S[3])
r0 = math.dist(S[0], POLE)
th0 = math.atan2(S[0][1] - POLE[1], S[0][0] - POLE[0])
th1 = math.atan2(S[1][1] - POLE[1], S[1][0] - POLE[0])
turn = math.copysign(math.pi / 2, math.sin(th1 - th0))   # +/- 90 deg per square

def spiral(t):
    r = r0 * PHI ** (-t)
    a = th0 + turn * t
    return (POLE[0] + r * math.cos(a), POLE[1] + r * math.sin(a))

# sanity: the log spiral should pass through every square corner
err = max(math.dist(spiral(k), S[k]) for k in range(6))

f = lambda v: f"{v:.2f}"
def poly(points):
    return "M" + " L".join(f"{f(x)} {f(y)}" for x, y in points)

T_MAX = 10.5
spiral_pts = [spiral(T_MAX - T_MAX * i / 700) for i in range(701)]   # drawn from the eye outward

SPIRAL_EASE = (0.3, 0.0, 0.25, 1.0)      # must match the spiral easing in js/main.js (draw())

def time_for_progress(p, e=SPIRAL_EASE):
    """Invert a CSS cubic-bezier: the time fraction at which drawn progress reaches p."""
    x1, y1, x2, y2 = e
    bez = lambda s, a, b: 3 * a * s * (1 - s) ** 2 + 3 * b * s * s * (1 - s) + s ** 3
    lo, hi = 0.0, 1.0
    for _ in range(60):
        mid = (lo + hi) / 2
        if bez(mid, y1, y2) < p: lo = mid
        else: hi = mid
    return bez((lo + hi) / 2, x1, x2)

# ---- septa: chamber walls from one whorl to the next, curved toward the aperture ----
septa = []
t = 0.34
while t < 5.2:
    A = spiral(t)            # outer whorl
    B = spiral(t + 4)        # same direction, one turn in
    mx, my = (A[0] + B[0]) / 2, (A[1] + B[1]) / 2
    dx, dy = A[0] - B[0], A[1] - B[1]
    L = math.hypot(dx, dy)
    nx, ny = -dy / L, dx / L
    bow = 0.2 * L * (1 if turn > 0 else -1)
    C = (mx + nx * bow, my + ny * bow)
    septa.append((t, f"M{f(B[0])} {f(B[1])} Q{f(C[0])} {f(C[1])} {f(A[0])} {f(A[1])}"))
    t += 0.3

# ---- timeline (seconds) ----
LOOP = 16.0
GRID_T, SQ_T0, SQ_STEP, SQ_D = 0.0, 0.25, 0.16, 0.9
SPIRAL_T, SPIRAL_D = 1.3, 4.2

out = []
out.append(f'<svg class="shell" viewBox="0 0 {VB_W} {VB_H}" preserveAspectRatio="xMidYMid meet" '
           f'aria-hidden="true" focusable="false" data-loop="{LOOP}">')
out.append('  <g class="shell__art">')

# proportional grid: every subdivision edge, extended across the whole field
out.append(f'    <g class="shell__grid" data-t="{GRID_T}" data-d="1.6">')
xs = sorted({round(v, 2) for sx, sy, ss in squares[:6] for v in (sx, sx + ss)})
ys = sorted({round(v, 2) for sx, sy, ss in squares[:6] for v in (sy, sy + ss)})
for x in xs:
    out.append(f'      <line x1="{x}" y1="0" x2="{x}" y2="{VB_H}"/>')
for y in ys:
    out.append(f'      <line x1="0" y1="{y}" x2="{VB_W}" y2="{y}"/>')
out.append('    </g>')

out.append('    <g class="shell__squares">')
for k, (sx, sy, ss) in enumerate(squares[:9]):
    d = f"M{f(sx)} {f(sy)} h{f(ss)} v{f(ss)} h{f(-ss)} Z"
    out.append(f'      <path class="shell__draw" d="{d}" pathLength="1" data-t="{SQ_T0 + SQ_STEP * k:.2f}" data-d="{SQ_D}"/>')
out.append('    </g>')

out.append(f'    <path class="shell__frame shell__draw" d="M{f(X0)} {f(Y0)} h{f(W)} v{f(H)} h{f(-W)} Z" '
           f'pathLength="1" data-t="0.1" data-d="1.4"/>')

out.append('    <g class="shell__septa">')
for (st, d) in septa:
    # appears the moment the growing spiral front reaches the wall's outer end.
    # Arc length of a log spiral from its pole is proportional to radius, so the drawn
    # fraction at parameter t is phi^-t; invert the spiral's easing to get the time.
    appear = SPIRAL_T + SPIRAL_D * time_for_progress(PHI ** (-st)) + 0.05
    out.append(f'      <path class="shell__draw" d="{d}" pathLength="1" data-t="{appear:.2f}" data-d="0.7"/>')
out.append('    </g>')

out.append(f'    <path class="shell__spiral shell__draw" d="{poly(spiral_pts)}" pathLength="1" '
           f'data-t="{SPIRAL_T}" data-d="{SPIRAL_D}"/>')
out.append(f'    <circle class="shell__eye" cx="{f(POLE[0])}" cy="{f(POLE[1])}" r="2.2" data-t="0.9" data-d="0.6"/>')
out.append('  </g>')
out.append('</svg>')
svg = "\n".join(out)
assert err < 1e-6, f"spiral does not pass through the square corners (error {err})"
print(svg)
