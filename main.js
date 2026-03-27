let modData = {
    items: [],
    blocks: []
};
let temporaryItemData = {};
let existingIdentifiers = [];
(async () => {
    if (document.getElementById("modTexturePreview").complete) {
        modData.image = await blobOfImg(document.getElementById("modTexturePreview"))
    } else {
        document.getElementById("modTexturePreview").onload = async () => {
            modData.image = await blobOfImg(document.getElementById("modTexturePreview"))
        }
    }
})();

Blockly.defineBlocksWithJsonArray([
    {
        type: "events_whenBlockStepped",
        message0: "when block stepped on",
        message1: "%1",
        colour: "#007e00",
        args1: [
            {
                "type": "input_statement",
                "name": "CODE"
            }
        ]
    },
    {
        type: "events_whenBlockUsed",
        message0: "when block used",
        message1: "%1",
        colour: "#007e00",
        args1: [
            {
                "type": "input_statement",
                "name": "CODE"
            }
        ]
    },
    {
        type: "events_whenItemUsed",
        message0: "when item used",
        message1: "%1",
        colour: "#007e00",
        args1: [
            {
                "type": "input_statement",
                "name": "CODE"
            }
        ]
    },
    {
        type: "events_whenItemHitEntity",
        message0: "when entity hit with item",
        message1: "%1",
        colour: "#007e00",
        args1: [
            {
                "type": "input_statement",
                "name": "CODE"
            }
        ]
    },
    {
        type: "entity",
        message0: "entity",
        colour: "#003cff",
        output: "entity"
    },
    {
        type: "sourceentity",
        message0: "source entity",
        colour: "#003cff",
        output: "entity"
    },
    {
        type: "runCommand",
        message0: "run command %1 on %2",
        colour: "#003cff",
        args0: [
            {
                "type": "input_value",
                "name": "COMMAND",
                "check": "String"
            },
            {
                "type": "input_value",
                "name": "ENTITY",
                "check": "entity"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true
    },
]);

Blockly.JavaScript.forBlock['events_whenBlockStepped'] = function (block, generator) {
    const code = generator.statementToCode(block, 'CODE');
    return `
featureUUID = crypto.randomUUID();
code = code + \`
features["\${featureUUID}"] = {
    onStepOn(event) {
        const defaultEntity = event.entity
        const sourceEntity = event.entity
        ${code}
    }
};

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent(
        "\${modIdentifier + ":" + newItemIdentifier + featureUUID}",
        features["\${featureUUID}"]
    );
});

\`;

components[modIdentifier + ":" + newItemIdentifier + featureUUID] = {};

`
};

Blockly.JavaScript.forBlock['events_whenBlockUsed'] = function (block, generator) {
    const code = generator.statementToCode(block, 'CODE');
    return `
featureUUID = crypto.randomUUID();
code = code + \`
features["\${featureUUID}"] = {
    onPlayerInteract(event) {
        const defaultEntity = event.player
        const sourceEntity = event.player
        ${code}
    }
};

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent(
        "\${modIdentifier + ":" + newItemIdentifier + featureUUID}",
        features["\${featureUUID}"]
    );
});

\`;

components[modIdentifier + ":" + newItemIdentifier + featureUUID] = {};

`
};

Blockly.JavaScript.forBlock['events_whenItemUsed'] = function (block, generator) {
    const code = generator.statementToCode(block, 'CODE');
    return `
featureUUID = crypto.randomUUID();
code = code + \`
features["\${featureUUID}"] = {
    onUse(event) {
        const defaultEntity = event.source
        const sourceEntity = event.source
        ${code}
    }
};

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent(
        "\${modIdentifier + ":" + newItemIdentifier + featureUUID}",
        features["\${featureUUID}"]
    );
});

\`;

components[modIdentifier + ":" + newItemIdentifier + featureUUID] = {};

`
};

Blockly.JavaScript.forBlock['events_whenItemHitEntity'] = function (block, generator) {
    const code = generator.statementToCode(block, 'CODE');
    return `
featureUUID = crypto.randomUUID();
code = code + \`
features["\${featureUUID}"] = {
    onHitEntity(event) {
        const defaultEntity = event.hitEntity
        const sourceEntity = event.attackingEntity
        ${code}
    }
};

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent(
        "\${modIdentifier + ":" + newItemIdentifier + featureUUID}",
        features["\${featureUUID}"]
    );
});

\`;

components[modIdentifier + ":" + newItemIdentifier + featureUUID] = {};

`
};


Blockly.JavaScript.forBlock['entity'] = function (block, generator) {
    return ["defaultEntity", 99]
};

Blockly.JavaScript.forBlock['sourceentity'] = function (block, generator) {
    return ["sourceEntity", 99]
};

Blockly.JavaScript.forBlock['runCommand'] = function (block, generator) {
    const entity = generator.valueToCode(block, 'ENTITY', 99);
    const command = generator.valueToCode(block, 'COMMAND', 99);
    return `${entity}.runCommand(${command});`
};


const blocktoolbox = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "category",
            name: "Events",
            colour: "#007e00",
            contents: [
                {
                    kind: 'block',
                    type: 'events_whenBlockStepped'
                },
                {
                    kind: 'block',
                    type: 'events_whenBlockUsed'
                },
            ]
        },
        {
            kind: "category",
            name: "Entity",
            colour: "#003cff",
            contents: [
                {
                    kind: 'block',
                    type: 'entity'
                },
                {
                    kind: 'block',
                    type: 'sourceentity'
                },
                {
                    kind: 'block',
                    type: 'runCommand'
                },
            ]
        },
        {
            kind: "category",
            name: "Text",
            colour: "#5ba58c",
            contents: [
                {
                    kind: 'block',
                    type: 'text'
                },
            ]
        },
    ]
};

const itemtoolbox = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "category",
            name: "Events",
            colour: "#007e00",
            contents: [
                {
                    kind: 'block',
                    type: 'events_whenItemUsed'
                },
                {
                    kind: 'block',
                    type: 'events_whenItemHitEntity'
                }
            ]
        },
        {
            kind: "category",
            name: "Entity",
            colour: "#003cff",
            contents: [
                {
                    kind: 'block',
                    type: 'entity'
                },
                {
                    kind: 'block',
                    type: 'sourceentity'
                },
                {
                    kind: 'block',
                    type: 'runCommand'
                },
            ]
        },
        {
            kind: "category",
            name: "Text",
            colour: "#5ba58c",
            contents: [
                {
                    kind: 'block',
                    type: 'text'
                },
            ]
        },
    ]
};

Blockly.Theme.defineTheme('dark', {
    name: 'dark',
    base: Blockly.Themes.Classic,
    componentStyles: {
        workspaceBackgroundColour: '#1e1e1e',
        toolboxBackgroundColour: '#333',
        toolboxForegroundColour: '#fff',
        flyoutBackgroundColour: '#252526',
        flyoutForegroundColour: '#ccc',
        flyoutOpacity: 1,
        scrollbarColour: '#797979',
        insertionMarkerColour: '#fff',
        insertionMarkerOpacity: 0.3,
        scrollbarOpacity: 0.4,
        cursorColour: '#d0d0d0',
    },
    startHats: true
});

const workspace = Blockly.inject('codeContainer', {
    theme: 'dark',
    grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true
    },
    renderer: 'zelos',
    toolbox: blocktoolbox,
    disableOrphans: true
});
function promptTexture() {
    return new Promise((resolve) => {
        const textureCanvasE = document.getElementById("textureCanvas");
        const ctx = textureCanvasE.getContext("2d");
        let drawing = false;
        ctx.clearRect(0, 0, 16, 16)

        const mouseDown = (e) => {
            drawing = true
            const rect = textureCanvasE.getBoundingClientRect();

            const scaleX = textureCanvasE.width / rect.width;
            const scaleY = textureCanvasE.height / rect.height;

            const x = Math.floor((e.clientX - rect.left) * scaleX);
            const y = Math.floor((e.clientY - rect.top) * scaleY);

            ctx.fillStyle = document.getElementById("textureColor").value;
            ctx.fillRect(x, y, 1, 1);
        };

        const mouseUp = (e) => {
            drawing = false
        };

        const mouseMove = (e) => {
            if (drawing) {
                const rect = textureCanvasE.getBoundingClientRect();

                const scaleX = textureCanvasE.width / rect.width;
                const scaleY = textureCanvasE.height / rect.height;

                const x = Math.floor((e.clientX - rect.left) * scaleX);
                const y = Math.floor((e.clientY - rect.top) * scaleY);

                ctx.fillStyle = document.getElementById("textureColor").value;
                ctx.fillRect(x, y, 1, 1);
            }
        };

        textureCanvasE.addEventListener("mousedown", mouseDown);

        textureCanvasE.addEventListener("mouseup", mouseUp);

        textureCanvasE.addEventListener("mouseleave", mouseUp);

        textureCanvasE.addEventListener("mousemove", mouseMove);

        document.getElementById("textureEditor").hidden = false;

        document.getElementById("confirmTexture").addEventListener("click", () => {
            document.getElementById("textureEditor").hidden = true;
            textureCanvasE.removeEventListener("mousedown", mouseDown);
            textureCanvasE.removeEventListener("mouseup", mouseUp);
            textureCanvasE.removeEventListener("mousemove", mouseMove);
            textureCanvasE.removeEventListener("mouseleave", mouseUp);
            textureCanvasE.toBlob(function (blob) {
                resolve(blob)
            }, 'image/png');
        });
    });
}

function promptCode(save, isItem) {
    return new Promise(async (resolve) => {
        document.getElementById("codeEditor").hidden = false;
        if (isItem) {
            workspace.updateToolbox(itemtoolbox)
        } else {
            workspace.updateToolbox(blocktoolbox)
        }
        Blockly.svgResize(workspace);
        if (save === null) {
            workspace.clear();
        } else {
            await Blockly.serialization.workspaces.load(save, workspace);
        }
        document.getElementById("saveCode").addEventListener("click", () => {
            document.getElementById("codeEditor").hidden = true;
            try {
                Blockly.getSelected().render()
            } catch { }
            resolve(Blockly.JavaScript.workspaceToCode(workspace));
        })
    })
}



function blobOfImg(img) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
            resolve(blob)
        }, 'image/png');

        canvas.remove();
    })
}








document.getElementById("optionBar").hidden = true;
document.getElementById("makeModButton").addEventListener("click", () => {

    modData.modName = document.getElementById("modname").value
    modData.modDesc = document.getElementById("moddesc").value
    document.getElementById("optionBar").hidden = false;
    document.getElementById("setup").hidden = true;
});

function createNewIdentifier(text) {
    let newText = String(text)
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    newText = newText.replaceAll(" ", "_")
    if (numbers.includes(newText.charAt(0))) {
        newText = "item_" + newText
    }
    newText = newText.toLowerCase();
    let i = 0
    let filterText = ""
    const minecraftAllowedChars = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
        'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        '_', '-', '.'
    ];
    while (i < newText.length) {
        if (!minecraftAllowedChars.includes(newText.charAt(i))) {
            filterText = filterText + "_"
        } else {
            filterText = filterText + newText.charAt(i)
        }
        i++;
    }
    i = 1
    let finalText = filterText
    if (existingIdentifiers.includes(finalText)) {
        while (existingIdentifiers.includes(finalText)) {
            i++;
            finalText = filterText + "_" + String(i)
        }
    }
    return finalText
}

document.getElementById("downloadMod").addEventListener("click", async () => {
    const modIdentifier = createNewIdentifier(modData.modName)
    let item_texture = {
        texture_data: {}
    }
    let block_texture = {
        texture_data: {}
    }
    let zip = new JSZip();
    const bpUUID = crypto.randomUUID();
    const rpUUID = crypto.randomUUID();
    let lang = ""
    let code = `import { world, system } from "@minecraft/server";\nlet features = {};\n`
    zip.file("BP/manifest.json", JSON.stringify({
        format_version: 3,
        header: {
            name: "pack.name",
            description: "pack.description",
            uuid: bpUUID,
            version: "1.0.0",
            min_engine_version: "1.26.0"
        },
        modules: [
            {
                type: "data",
                uuid: crypto.randomUUID(),
                version: "1.0.0"
            },
            {
                uuid: crypto.randomUUID(),
                version: "1.0.0",
                type: "script",
                language: "javascript",
                entry: "scripts/code.js"
            }
        ],
        metadata: {
            authors: ["Minecraft Mod Wizard"],
            product_type: "addon"
        },
        dependencies: [
            {
                module_name: "@minecraft/server",
                version: "2.3.0"
            }
        ]
    }));

    zip.file("RP/manifest.json", JSON.stringify({
        format_version: 3,
        header: {
            name: "pack.name",
            description: "pack.description",
            uuid: rpUUID,
            version: "1.0.0",
            min_engine_version: "1.26.0"
        },
        modules: [
            {
                type: "resources",
                uuid: crypto.randomUUID(),
                version: "1.0.0"
            }
        ],
        metadata: {
            authors: ["Minecraft Mod Wizard"],
            product_type: "addon"
        },
        capabilities: ["pbr"]
    }))
    lang = lang + `pack.name=${modData.modName}\n`
    lang = lang + `pack.description=${modData.modDesc}\n`
    zip.file("BP/texts/en_US.lang", `pack.name=${modData.modName}\npack.description=${modData.modDesc}`)
    zip.file("RP/texts/languages.json", `["en_US"]`)
    zip.file("BP/texts/languages.json", `["en_US"]`)

    modData.items.forEach(element => {
        const newItemIdentifier = createNewIdentifier(element.name)
        existingIdentifiers.push(newItemIdentifier)
        let components = {
            "minecraft:icon": modIdentifier + ":" + newItemIdentifier
        }
        let featureUUID = "";
        if (element.code !== null) {
            eval(element.code)
        }
        zip.file("BP/items/" + newItemIdentifier + ".json", JSON.stringify({
            format_version: "1.26.0",
            "minecraft:item": {
                description: {
                    identifier: modIdentifier + ":" + newItemIdentifier,
                    menu_category: {
                        category: "items"
                    }
                },
                components: components
            }
        }))
        item_texture.texture_data[modIdentifier + ":" + newItemIdentifier] = {
            textures: "textures/items/" + newItemIdentifier
        }
        zip.file("RP/textures/items/" + newItemIdentifier + ".png", element.image)
        lang = lang + `item.${modIdentifier}:${newItemIdentifier}=${element.name}\n`
    });
    modData.blocks.forEach(element => {
        let featureUUID = "";
        const newItemIdentifier = createNewIdentifier(element.name)
        existingIdentifiers.push(newItemIdentifier)
        let components = {
            "minecraft:geometry": "minecraft:geometry.full_block",
            "minecraft:material_instances": {
                "*": {
                    texture: modIdentifier + ":" + newItemIdentifier,
                    render_method: "blend",
                }
            }
        }

        if (element.code !== null) {
            eval(element.code)
        }
        zip.file("BP/blocks/" + newItemIdentifier + ".json", JSON.stringify({
            format_version: "1.26.0",
            "minecraft:block": {
                description: {
                    identifier: modIdentifier + ":" + newItemIdentifier,
                    menu_category: {
                        category: "construction",
                    }
                },
                components: components
            }
        }))
        block_texture.texture_data[modIdentifier + ":" + newItemIdentifier] = {
            textures: "textures/blocks/" + newItemIdentifier
        }
        zip.file("RP/textures/blocks/" + newItemIdentifier + ".png", element.image)
        lang = lang + `tile.${modIdentifier}:${newItemIdentifier}.name=${element.name}\n`
        if (element.isOre) {
            zip.file("BP/features/" + newItemIdentifier + "_ore_feature.json", JSON.stringify(
                {
                    format_version: "1.17.0",
                    "minecraft:ore_feature": {
                        description: {
                            identifier: modIdentifier + ":" + newItemIdentifier + "_ore_feature"
                        },
                        count: element.oreClusterSize,
                        replace_rules: [
                            {
                                places_block: modIdentifier + ":" + newItemIdentifier,
                                may_replace: ["minecraft:stone"]
                            },
                            {
                                places_block: modIdentifier + ":" + newItemIdentifier,
                                may_replace: ["minecraft:deepslate"]
                            }
                        ]
                    }
                }
            ))
            zip.file("BP/feature_rules/overworld_underground_" + newItemIdentifier + "_ore_feature.json", JSON.stringify({
                format_version: "1.13.0",
                "minecraft:feature_rules": {
                    description: {
                        identifier: modIdentifier + ":overworld_underground_" + newItemIdentifier + "_ore_feature",
                        places_feature: modIdentifier + ":" + newItemIdentifier + "_ore_feature"
                    },
                    conditions: {
                        placement_pass: "underground_pass",
                        "minecraft:biome_filter": [
                            // Scatter the ore throughout the Overworld
                            {
                                any_of: [
                                    {
                                        test: "has_biome_tag",
                                        operator: "==",
                                        value: "overworld"
                                    },
                                    {
                                        test: "has_biome_tag",
                                        operator: "==",
                                        value: "overworld_generation"
                                    }
                                ]
                            }
                        ]
                    },
                    distribution: {
                        iterations: 10, // Placement attempts of the cluster, not the ore blocks
                        coordinate_eval_order: "zyx",
                        x: {
                            distribution: "uniform",
                            extent: [0, 16]
                        },
                        y: {
                            distribution: "uniform", // You can use "triangle" to make ores more common in the middle of the extent
                            extent: [
                                0, // Minimum y level for the ore to generate
                                62 // Maximum y level for the ore to generate
                            ]
                        },
                        z: {
                            distribution: "uniform",
                            extent: [0, 16]
                        }
                    }
                }
            }))
        }
    });
    zip.file("RP/textures/item_texture.json", JSON.stringify(item_texture))
    zip.file("RP/textures/terrain_texture.json", JSON.stringify(block_texture))
    zip.file("RP/texts/en_US.lang", lang)
    zip.file("RP/pack_icon.png", modData.image)
    zip.file("BP/pack_icon.png", modData.image)
    zip.file("BP/scripts/code.js", code)
    const generatedBlob = await zip.generateAsync({ type: "blob" });
    const handle = await window.showSaveFilePicker({
        suggestedName: "mod.mcaddon",
        types: [{
            description: "Minecraft Addon",
            accept: {
                "application/octet-stream": ".mcaddon"
            }
        }]
    });

    const writable = await handle.createWritable();
    await writable.write(generatedBlob);
    await writable.close();

});

document.getElementById("addElement").addEventListener("click", () => {
    document.getElementById("elementList").hidden = !document.getElementById("elementList").hidden
});

document.getElementById("addItem").addEventListener("click", async () => {
    document.getElementById("elementList").hidden = true
    document.getElementById("itemEditor").hidden = false
    temporaryItemData = {}
    temporaryItemData.name = "Item"
    document.getElementById("itemTexturePreview").src = "./images/missingTexture.png"
    temporaryItemData.image = await blobOfImg(document.getElementById("itemTexturePreview"))
    document.getElementById("itemName").value = "Item"
    temporaryItemData.code = null;
    temporaryItemData.codeSave = null;
});

document.getElementById("itemTexturePreview").addEventListener("click", async () => {
    document.getElementById("itemEditor").hidden = true
    const newImg = await promptTexture()
    temporaryItemData.image = newImg
    document.getElementById("itemEditor").hidden = false
    const objectURL = URL.createObjectURL(newImg);
    document.getElementById("itemTexturePreview").src = objectURL
    document.getElementById("itemTexturePreview").onload = () => {
        URL.revokeObjectURL(objectURL);
    }
});

document.getElementById("saveItem").addEventListener("click", () => {
    temporaryItemData.name = document.getElementById("itemName").value
    modData.items.push(temporaryItemData);
    temporaryItemData = {}
    document.getElementById("itemEditor").hidden = true
});

document.getElementById("modTexturePreview").addEventListener("click", async () => {
    document.getElementById("setup").hidden = true
    const newImg = await promptTexture()
    modData.image = newImg
    document.getElementById("setup").hidden = false
    const objectURL = URL.createObjectURL(newImg);
    document.getElementById("modTexturePreview").src = objectURL
    document.getElementById("modTexturePreview").onload = () => {
        URL.revokeObjectURL(objectURL);
    }
});

document.getElementById("addBlock").addEventListener("click", async () => {
    document.getElementById("elementList").hidden = true
    document.getElementById("oreInfo").hidden = true
    document.getElementById("blockEditor").hidden = false
    temporaryItemData = {}
    temporaryItemData.name = "Block"
    document.getElementById("blockTexturePreview").src = "./images/missingTexture.png"
    temporaryItemData.image = await blobOfImg(document.getElementById("blockTexturePreview"))
    document.getElementById("blockName").value = "Block"
    document.getElementById("isBlockOre").checked = false
    document.getElementById("oreClusterSize").value = 8
    temporaryItemData.code = null;
    temporaryItemData.codeSave = null;
});

document.getElementById("blockTexturePreview").addEventListener("click", async () => {
    document.getElementById("blockEditor").hidden = true
    const newImg = await promptTexture()
    temporaryItemData.image = newImg
    document.getElementById("blockEditor").hidden = false
    const objectURL = URL.createObjectURL(newImg);
    document.getElementById("blockTexturePreview").src = objectURL
    document.getElementById("blockTexturePreview").onload = () => {
        URL.revokeObjectURL(objectURL);
    }
});

document.getElementById("saveBlock").addEventListener("click", () => {
    temporaryItemData.name = document.getElementById("blockName").value
    temporaryItemData.isOre = document.getElementById("isBlockOre").checked
    temporaryItemData.oreClusterSize = Number(document.getElementById("oreClusterSize").value)
    modData.blocks.push(temporaryItemData);
    temporaryItemData = {}
    document.getElementById("blockEditor").hidden = true
});

document.getElementById("isBlockOre").addEventListener("change", () => {
    document.getElementById("oreInfo").hidden = !document.getElementById("isBlockOre").checked
})

document.getElementById("addBlockCode").addEventListener("click", async () => {
    document.getElementById("blockEditor").hidden = true
    const code = await promptCode(temporaryItemData.codeSave || {}, false);
    document.getElementById("blockEditor").hidden = false
    temporaryItemData.code = code;
    temporaryItemData.codeSave = Blockly.serialization.workspaces.save(workspace);
});

document.getElementById("addItemCode").addEventListener("click", async () => {
    document.getElementById("itemEditor").hidden = true
    const code = await promptCode(temporaryItemData.codeSave || {},true);
    document.getElementById("itemEditor").hidden = false
    temporaryItemData.code = code;
    temporaryItemData.codeSave = Blockly.serialization.workspaces.save(workspace);
});

workspace.addChangeListener(Blockly.Events.disableOrphans);