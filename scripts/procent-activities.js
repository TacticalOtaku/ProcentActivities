/* Procent Activities Module */
try {
  console.log("ProcentActivities: Script loading...");
} catch (e) {
  console.error("ProcentActivities: Error during script loading:", e);
}

class ProcentActivitiesConfig extends FormApplication {
  static get defaultOptions() {
    console.log("ProcentActivities: Accessing defaultOptions");
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "procent-activities-config",
      title: game.i18n.localize("PA.Title"),
      template: "modules/procent-activities/templates/procent-activities-config.hbs",
      width: 400,
      height: "auto",
      closeOnSubmit: true
    });
  }

  getData() {
    const item = this.object;
    const flags = item.getFlag("procent-activities", "config") || {
      hpBase: "current",
      actionType: "damage",
      percentage: 0,
      allowOverlimit: false
    };
    console.log(`ProcentActivities: Loaded flags for item ${item.name}:`, flags);
    return {
      hpBase: flags.hpBase,
      actionType: flags.actionType,
      percentage: flags.percentage,
      allowOverlimit: flags.allowOverlimit
    };
  }

  async _updateObject(event, formData) {
    const item = this.object;
    const percentage = parseInt(formData.percentage, 10) || 0;
    const config = {
      hpBase: formData.hpBase,
      actionType: formData.actionType,
      percentage: percentage,
      allowOverlimit: formData.allowOverlimit
    };
    console.log(`ProcentActivities: Saving configuration for item ${item.name}:`, config);
    await item.setFlag("procent-activities", "config", config);
    const savedFlags = item.getFlag("procent-activities", "config");
    console.log(`ProcentActivities: Saved flags for item ${item.name}:`, savedFlags);
    if (savedFlags.percentage !== percentage) {
      console.error(`ProcentActivities: Percentage mismatch! Expected ${percentage}, got ${savedFlags.percentage}`);
    }
  }

  async _renderInner(data) {
    const html = await super._renderInner(data);
    const quantityInput = html.find('input[name="percentage"]');
    if (!data.allowOverlimit) {
      quantityInput.attr("max", 100);
    }
    return html;
  }

  setPosition(size) {
    if (!this.element?.length) return;
    const parentPosition = super.setPosition(size);
    if (!parentPosition) return;

    const el = this.element[0];
    if (!el) return parentPosition;

    try {
      const styles = window.getComputedStyle(el);
      const minHeight = parseInt(styles.minHeight) || 100;
      el.style.height = Math.max(minHeight, el.scrollHeight) + "px";
    } catch (err) {
      console.warn("ProcentActivities: Failed to compute styles for form positioning", err);
    }
    return parentPosition;
  }
}

Hooks.once("init", () => {
  console.log("ProcentActivities: Initializing module...");
  try {
    Handlebars.registerHelper("eq", function (a, b) {
      return a === b;
    });

    game.i18n.translations.PA = {
      Title: "Percentage Activities Configuration",
      HPBase: "HP Base",
      CurrentHP: "Current HP",
      MaxHP: "Maximum HP",
      ActionType: "Action Type",
      Damage: "Damage",
      Healing: "Healing",
      Percentage: "Percentage (%)",
      AllowOverlimit: "Allow Overlimit",
      Configure: "Percent Config",
      Settings: {
        AccessRestriction: "Access Restriction",
        AccessRestrictionHint: "Control who can configure percentage effects on items.",
        GMOnly: "Game Master Only",
        AllPlayers: "All Players"
      }
    };

    game.settings.register("procent-activities", "accessRestriction", {
      name: game.i18n.localize("PA.Settings.AccessRestriction"),
      hint: game.i18n.localize("PA.Settings.AccessRestrictionHint"),
      scope: "world",
      config: true,
      type: String,
      choices: {
        "gmOnly": game.i18n.localize("PA.Settings.GMOnly"),
        "allPlayers": game.i18n.localize("PA.Settings.AllPlayers")
      },
      default: "gmOnly",
      restricted: true,
      onChange: value => {
        console.log(`ProcentActivities: Access restriction changed to ${value}`);
      }
    });

    console.log("ProcentActivities: Module initialized successfully");
  } catch (e) {
    console.error("ProcentActivities: Error during initialization:", e);
  }
});

Hooks.on("renderItemSheet", (app, html, data) => {
  console.log("ProcentActivities: renderItemSheet triggered for item", data.item.name);
  const item = app.object;
  const supportedTypes = ["weapon", "spell", "equipment", "consumable", "tool", "loot", "feature"];
  if (!supportedTypes.includes(item.type)) {
    console.log(`ProcentActivities: Skipping item type ${item.type} for ${item.name}`);
    return;
  }

  // Удаляем старую кнопку, чтобы избежать дублирования
  const existingButton = html.find(".procent-config-btn")[0];
  if (existingButton) {
    existingButton.remove();
    console.log(`ProcentActivities: Removed existing button for item ${item.name}`);
  }

  // Проверяем режим редактирования
  console.log(`ProcentActivities: Is sheet editable for ${item.name}? ${app.isEditable}`);
  if (!app.isEditable) {
    console.log(`ProcentActivities: Item sheet for ${item.name} is not editable, skipping button`);
    return;
  }

  // Проверяем настройки доступа
  const accessRestriction = game.settings.get("procent-activities", "accessRestriction");
  const isGM = game.user.isGM;
  console.log(`ProcentActivities: Access restriction: ${accessRestriction}, Is GM: ${isGM}`);
  if (accessRestriction === "gmOnly" && !isGM) {
    console.log(`ProcentActivities: Access restricted to GM for ${item.name}, skipping button for non-GM user`);
    return;
  }

  // Создаём кнопку
  const button = document.createElement("button");
  button.className = "procent-config-btn";
  button.title = game.i18n.localize("PA.Title");
  button.innerHTML = '<i class="fas fa-percentage"></i>';

  // Добавляем обработчик события
  button.addEventListener("click", (event) => {
    event.preventDefault(); // Предотвращаем стандартное поведение
    console.log(`ProcentActivities: Opening config for item ${item.name}`);
    try {
      new ProcentActivitiesConfig(item).render(true);
    } catch (e) {
      console.error(`ProcentActivities: Error opening config for item ${item.name}:`, e);
    }
  });

  // Пытаемся найти элемент .tabs
  const tabs = html.find(".tabs")[0];
  if (tabs) {
    console.log(`ProcentActivities: Found .tabs for ${item.name}`);
    tabs.appendChild(button);
  } else {
    console.warn(`ProcentActivities: Could not find .tabs for ${item.name}, button not added. DOM structure:`, html[0].outerHTML);
    return;
  }

  console.log(`ProcentActivities: Added button for item ${item.name}`);
});

Hooks.on("midi-qol.RollComplete", async (workflow) => {
  console.log(`ProcentActivities: midi-qol.RollComplete triggered for item ${workflow.item.name}`);
  try {
    const item = workflow.item;
    const actor = workflow.actor;
    console.log(`ProcentActivities: Processing item ${item.name} for actor ${actor.name}`);
    
    const flags = item.getFlag("procent-activities", "config");
    if (!flags) {
      console.log(`ProcentActivities: No procent-activities config found for item ${item.name}`);
      return;
    }

    const { hpBase, actionType, percentage, allowOverlimit } = flags;
    console.log(`ProcentActivities: Config for item ${item.name}:`, { hpBase, actionType, percentage, allowOverlimit });

    const target = workflow.targets.first();
    if (!target) {
      console.warn(`ProcentActivities: No target found for damage application`);
      return;
    }
    const targetActor = target.actor;
    const maxHP = targetActor.system.attributes.hp.max;
    const currentHP = targetActor.system.attributes.hp.value;
    const baseHP = hpBase === "current" ? currentHP : maxHP;
    console.log(`ProcentActivities: HP values for target ${targetActor.name} - CurrentHP: ${currentHP}, MaxHP: ${maxHP}, BaseHP: ${baseHP}`);

    let amount = Math.round((baseHP * percentage) / 100);
    console.log(`ProcentActivities: Calculating ${actionType} for ${targetActor.name}. BaseHP: ${baseHP}, Percentage: ${percentage}, Amount: ${amount}`);

    if (!allowOverlimit && percentage > 100) {
      amount = Math.round(baseHP);
      console.log(`ProcentActivities: Capped amount to ${amount} due to allowOverlimit=false`);
    }

    if (actionType === "damage") {
      console.log(`ProcentActivities: Applying damage to target ${targetActor.name}`);
      await MidiQOL.applyTokenDamage(
        [{ damage: amount, type: "none" }],
        amount,
        new Set([target]),
        item,
        null
      );
      console.log(`ProcentActivities: Applied ${amount} damage to ${targetActor.name}`);
    } else if (actionType === "healing") {
      const newHP = Math.floor(Math.min(currentHP + amount, maxHP));
      console.log(`ProcentActivities: Applying healing to ${targetActor.name}. CurrentHP: ${currentHP}, NewHP: ${newHP}`);
      await targetActor.update({ "system.attributes.hp.value": newHP });
    }
  } catch (e) {
    console.error(`ProcentActivities: Error in midi-qol.RollComplete for item ${workflow.item.name}:`, e);
  }
});

Hooks.on("preCreateActiveEffect", (effect, data, options, userId) => {
  console.log(`ProcentActivities: preCreateActiveEffect triggered for effect origin ${data.origin}`);
  try {
    const item = fromUuidSync(data.origin);
    if (!item || !item.getFlag("procent-activities", "config")) {
      console.log(`ProcentActivities: No procent-activities config found for effect origin ${data.origin}`);
      return;
    }

    const flags = item.getFlag("procent-activities", "config");
    console.log(`ProcentActivities: DAE config for item ${item.name}:`, flags);
    effect.updateSource({
      "flags.dae.macro": {
        name: "ProcentActivitiesEffect",
        content: `
          const actor = this.actor;
          const item = this.item;
          const flags = item.getFlag("procent-activities", "config");
          console.log("ProcentActivities: DAE macro executing for actor " + actor.name + ", item " + item.name, flags);
          const baseHP = flags.hpBase === "current" ? actor.system.attributes.hp.value : actor.system.attributes.hp.max;
          let amount = Math.round((baseHP * flags.percentage) / 100);
          if (!flags.allowOverlimit && flags.percentage > 100) amount = Math.round(baseHP);
          console.log("ProcentActivities: DAE calculating " + flags.actionType + " for " + actor.name + ". BaseHP: " + baseHP + ", Percentage: " + flags.percentage + ", Amount: " + amount);
          if (flags.actionType === "damage") {
            await MidiQOL.applyTokenDamage(
              [{ damage: amount, type: "none" }],
              amount,
              new Set([actor]),
              item,
              null
            );
            console.log("ProcentActivities: DAE applied " + amount + " damage to " + actor.name);
          } else if (flags.actionType === "healing") {
            const newHP = Math.floor(Math.min(actor.system.attributes.hp.value + amount, actor.system.attributes.hp.max));
            console.log("ProcentActivities: DAE applying healing to " + actor.name + ". CurrentHP: " + actor.system.attributes.hp.value + ", NewHP: " + newHP);
            await actor.update({ "system.attributes.hp.value": newHP });
          }
        `
      }
    });
  } catch (e) {
    console.error(`ProcentActivities: Error in preCreateActiveEffect:`, e);
  }
});