/* global xelib */

function findVisuals(record, visuals) {
    overrides = xelib.GetOverrides(record)
    if (overrides.length < 2) {
        return undefined;
    }
    for (let i = overrides.length - 1; i >= 0; i--) {
        r = overrides[i]
        rf = xelib.GetElementFile(r)
        fname = xelib.GetFileName(rf)
        xelib.Release(rf)
        if (visuals.includes(fname)) {
            return r;
        }
    }
    return undefined;
}

function copyFromVisual(record, visual, path) {
    prev = xelib.GetElement(visual, path);
    if (prev) {
        new_pos = xelib.GetElement(record, path)
        if (new_pos) {
            xelib.RemoveElement(record, path)
        }
        new_pos = xelib.AddElement(record, path)
        xelib.SetElement(new_pos, prev)
        xelib.Release(prev)
        xelib.Release(new_pos)
    } else {
        xelib.RemoveElement(record, path)
    }
}

registerPatcher({
    info: info,
    gameModes: [xelib.gmTES5, xelib.gmSSE],
    settings: {
        label: 'NPC VisualTransfer',
        templateUrl: `${patcherUrl}/partials/settings.html`,
        defaultSettings: {
            visualMods: ""
        }
    },
    getFilesToPatch: function (filenames) {
        return filenames;
    },
    execute: (patchFile, helpers, settings, locals) => ({
        initialize: function () {
            helpers.logMessage(`settings: ${JSON.stringify(settings)}`);
            locals.visual_data = settings.visualMods.split("\n").map(s => s.trim());
        },        
        process: [{
            load: {
                signature: 'NPC_',
                filter: function (record) {
                    p = findVisuals(record, locals.visual_data);
                    if (p) {
                        xelib.Release(p)
                        return true
                    }
                    return false
                }
            },
            patch: function (record) {
                helpers.logMessage(`Processing visual transfer for ${xelib.LongName(record)}`);
                visual = findVisuals(record,  locals.visual_data);
                if (!visual) {
                    return
                }
                copyFromVisual(record, visual, 'WNAM - Worn Armor')
                copyFromVisual(record, visual, 'HCLF - Hair Color')
                copyFromVisual(record, visual, 'Head Parts')
                copyFromVisual(record, visual, 'FTST - Head texture')
                copyFromVisual(record, visual, 'QNAM - Texture lighting')
                copyFromVisual(record, visual, 'NAM9 - Face morph')
                copyFromVisual(record, visual, 'NAMA - Face parts')
                copyFromVisual(record, visual, 'Tint Layers')
                xelib.Release(visual)
            }
        }]
    })
});
