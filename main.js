let modData = {
    items: []
}
let temporaryItemData = {}
let existingIdentifiers = []

document.getElementById("modTexturePreview").onload = async () => {
    modData.image = await blobOfImg(document.getElementById("modTexturePreview"))
}

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
        }

        const mouseUp = (e) => {
            drawing = false
        }

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
        }

        textureCanvasE.addEventListener("mousedown", mouseDown);

        textureCanvasE.addEventListener("mouseup", mouseUp);

        textureCanvasE.addEventListener("mouseleave", mouseUp);

        textureCanvasE.addEventListener("mousemove", mouseMove)

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
        })
    });
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
    let zip = new JSZip();
    const bpUUID = crypto.randomUUID();
    const rpUUID = crypto.randomUUID();
    let lang = ""
    zip.file("BP/manifest.json", JSON.stringify({
        format_version: 3,
        header: {
            name: "pack.name",
            description: "pack.description",
            uuid: bpUUID,
            version: "1.0.0",
            min_engine_version: "1.26.0"
        },
        modules: [{
            type: "data",
            uuid: crypto.randomUUID(),
            version: "1.0.0"
        }],
        metadata: {
            authors: ["Minecraft Mod Wizard"],
            product_type: "addon"
        }
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
        zip.file("BP/items/" + newItemIdentifier + ".json", JSON.stringify({
            format_version: "1.26.0",
            "minecraft:item": {
                description: {
                    identifier: modIdentifier + ":" + newItemIdentifier,
                    menu_category: {
                        category: "items"
                    }
                },
                components: {
                    "minecraft:icon": modIdentifier + ":" + newItemIdentifier
                }
            }
        }))
        item_texture.texture_data[modIdentifier + ":" + newItemIdentifier] = {
            textures: "textures/items/" + newItemIdentifier
        }
        zip.file("RP/textures/items/" + newItemIdentifier + ".png", element.image)
        lang = lang + `item.${modIdentifier}:${newItemIdentifier}=${element.name}\n`
    });
    zip.file("RP/textures/item_texture.json", JSON.stringify(item_texture))
    zip.file("RP/texts/en_US.lang", lang)
    zip.file("RP/pack_icon.png", modData.image)
    zip.file("BP/pack_icon.png", modData.image)
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

})

document.getElementById("addElement").addEventListener("click", () => {
    document.getElementById("elementList").hidden = !document.getElementById("elementList").hidden
})

document.getElementById("addItem").addEventListener("click", async () => {
    document.getElementById("elementList").hidden = true
    document.getElementById("itemEditor").hidden = false
    temporaryItemData = {}
    temporaryItemData.name = "Item"
    document.getElementById("itemTexturePreview").src = "./images/missingTexture.png"
    temporaryItemData.image = await blobOfImg(document.getElementById("itemTexturePreview"))
    document.getElementById("itemName").value = "Item"
})

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
})

document.getElementById("saveItem").addEventListener("click", () => {
    temporaryItemData.name = document.getElementById("itemName").value
    modData.items.push(temporaryItemData);
    temporaryItemData = {}
    document.getElementById("itemEditor").hidden = true
})

document.getElementById("modTexturePreview").addEventListener("click", async () => {
    document.getElementById("setup").hidden = true
    const newImg = await promptTexture()
    temporaryItemData.image = newImg
    document.getElementById("setup").hidden = false
    const objectURL = URL.createObjectURL(newImg);
    document.getElementById("modTexturePreview").src = objectURL
    document.getElementById("modTexturePreview").onload = () => {
        URL.revokeObjectURL(objectURL);
    }
})