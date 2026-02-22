import csv
import json
from coloraide import Color

# ---------------------------------------------------------
# Base colors for each theme
# ---------------------------------------------------------
themes = {
    "Jupiter": {
        "primary": "#6E869C",
        "secondary": "#EE9D55",
        "tertiary": "#364A59",
        "neutral_mid": "#b0b5a5"
    },
    "Spring": {
        "primary": "#84D999",
        "secondary": "#4C735D",
        "tertiary": "#467f8a",
        "neutral_mid": "#aab2b3"
    },
    "Gold": {
        "primary": "#E8DE5A",
        "secondary": "#ae8211",
        "tertiary": "#705541",
        "neutral_mid": "#77787a"
    }
}

# ---------------------------------------------------------
# Helper: interpolate OKLCH
# ---------------------------------------------------------
def interpolate_oklch(hex_color, steps=10):
    base = Color(hex_color).convert("oklch")
    L, C, H = base["l"], base["c"], base["h"]

    # Darkest and lightest anchors (hue-true)
    L_dark = max(L * 0.35, 0.05)
    L_light = min(L * 1.35, 0.98)

    colors = []
    for i in range(steps):
        t = i / (steps - 1)
        L_i = L_dark + (L_light - L_dark) * t
        C_i = C  # preserve chroma
        H_i = H  # preserve hue
        col = Color("oklch", [L_i, C_i, H_i]).convert("srgb")
        colors.append(col.to_string(hex=True))
    return colors

# ---------------------------------------------------------
# Helper: neutral scale (chromatic)
# ---------------------------------------------------------
def interpolate_neutral(hex_color, steps=10):
    base = Color(hex_color).convert("oklch")
    L, C, H = base["l"], base["c"], base["h"]

    L_dark = max(L * 0.35, 0.05)
    L_light = min(L * 1.35, 0.98)
    C_neutral = C * 0.25  # reduce chroma for neutrals

    colors = []
    for i in range(steps):
        t = i / (steps - 1)
        L_i = L_dark + (L_light - L_dark) * t
        col = Color("oklch", [L_i, C_neutral, H]).convert("srgb")
        colors.append(col.to_string(hex=True))
    return colors

# ---------------------------------------------------------
# Generate all palettes
# ---------------------------------------------------------
tokens = {}
csv_rows = []

for theme, palettes in themes.items():
    tokens[theme] = {}

    for palette_name in ["primary", "secondary", "tertiary"]:
        scale = interpolate_oklch(palettes[palette_name])
        for i, hex_value in enumerate(scale, start=1):
            step = i * 10
            key = f"brand.{palette_name}.{step}"
            tokens[theme][key] = {
                "value": hex_value,
                "type": "color"
            }
            csv_rows.append([theme, palette_name, step, hex_value])

    # Neutrals
    neutral_scale = interpolate_neutral(palettes["neutral_mid"])
    for i, hex_value in enumerate(neutral_scale, start=1):
        step = i * 10
        key = f"brand.neutral.{step}"
        tokens[theme][key] = {
            "value": hex_value,
            "type": "color"
        }
        csv_rows.append([theme, "neutral", step, hex_value])

# ---------------------------------------------------------
# Write JSON
# ---------------------------------------------------------
with open("tokens.json", "w") as f:
    json.dump(tokens, f, indent=2)

# ---------------------------------------------------------
# Write CSV
# ---------------------------------------------------------
with open("tokens.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["theme", "palette", "step", "hex"])
    writer.writerows(csv_rows)

print("Generated tokens.json and tokens.csv successfully.")
