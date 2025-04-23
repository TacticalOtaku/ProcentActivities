# Procent Activities

**Procent Activities** is a Foundry VTT module that allows you to apply percentage-based damage or healing effects to items, compatible with the D&D 5e system, Midi QOL, and Dynamic Active Effects (DAE). It provides a user-friendly GUI for configuring these effects directly on item sheets.

## Features

- **Percentage-Based Effects**: Apply damage or healing as a percentage of a target's current or maximum HP.
- **GUI Configuration**: Add a `%` button to item sheets (visible in edit mode) to configure percentage effects.
- **Access Control**: Restrict configuration access to Game Masters (GM) or allow all players via a global setting.
- **Midi QOL Integration**: Seamlessly apply percentage effects during Midi QOL workflows.
- **DAE Support**: Configure percentage effects as active effects via DAE macros.
- **Customizable**: Choose between current or max HP as the base, set the percentage, and allow/disallow overlimit effects.

## Compatibility

- **Foundry VTT**: Minimum version 12, verified up to 12.331.
- **System**: D&D 5e (minimum 4.2.0, verified 4.2.2).
- **Dependencies**:
  - Midi QOL (minimum 12.4.27, verified 12.4.43).
  - Dynamic Active Effects (DAE) (minimum 12.0.12, verified 12.0.12).

## Installation

1. Open Foundry VTT.
2. Go to **Add-on Modules** → **Install Module**.
3. Paste the following manifest URL:
   ```
   https://raw.githubusercontent.com/TacticalOtaku/ProcentActivities/main/module.json
   ```
4. Click **Install**.
5. Activate the module in your world under **Manage Modules**.

Alternatively, download the ZIP file for version 1.0.14:
- [Download v1.0.14](https://github.com/TacticalOtaku/ProcentActivities/releases/download/v1.0.14/procent-activities-v1.0.14.zip)

## Usage

### Configuring Percentage Effects
1. Open an item sheet (e.g., weapon, spell, equipment, consumable, tool, loot, or feature) in **edit mode**.
2. Look for the `%` button in the header (next to other control icons).
3. Click the `%` button to open the configuration form.
4. Set the following options:
   - **HP Base**: Choose between "Current HP" or "Maximum HP".
   - **Action Type**: Select "Damage" or "Healing".
   - **Percentage (%)**: Enter the percentage value (e.g., 75 for 75%).
   - **Allow Overlimit**: Check to allow percentages above 100%.
5. Click **Save** to apply the settings.

### Applying Effects
- When the item is used in a Midi QOL workflow, the module will automatically calculate and apply the percentage-based damage or healing to the target.
- If using DAE, the effect will be applied as a macro when the active effect triggers.

### Module Settings
1. Go to **Configure Settings → Module Settings → Procent Activities**.
2. Configure the **Access Restriction** setting (only available to GMs):
   - **Game Master Only**: Only GMs can see and use the `%` button on item sheets.
   - **All Players**: All players can configure percentage effects.

## Screenshots

*(Add screenshots of the item sheet with the `%` button and the configuration form if desired)*

## Changelog

- **v1.0.14 (2025-04-23)**:
  - Restricted access to the `Access Restriction` setting in `Configure Settings` to GMs only.
- **v1.0.13**:
  - Moved the `%` button to `<div class="header-elements">` in the item sheet header.
  - Reduced button size to 16px and styled it to match other header icons (transparent background, light gray icon, red hover effect).
- **v1.0.12**:
  - Updated the `%` button style to a gray square with rounded corners and a black icon.
  - Repositioned the button next to the quantity field.
  - Redesigned the configuration form to match the button style (gray background, black text).
- **v1.0.11**:
  - Redesigned the configuration form to match the left menu style (dark gradient background, light text).
  - Reduced the `%` button size to 10px and increased its visibility with a light gray icon.
  - Updated the button's hover effect to a light red color.
- **v1.0.10 and earlier**:
  - Initial implementation of percentage-based damage/healing.
  - Added support for Midi QOL and DAE.
  - Introduced the `%` button and configuration form.

## Support

If you encounter any issues or have suggestions, please open an issue on the [GitHub repository](https://github.com/TacticalOtaku/ProcentActivities/issues).

## License

This module is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Happy gaming! 🎲