/* global ngapp, xelib */
const visuals = fh.loadJsonFile(patcherPath + '\\visuals.json')

function findVisuals(record) {
    overrides = xelib.GetOverrides(record)
    if (overrides.length < 2) {
        return undefined
    }
    for (let i = overrides.length - 1; i >= 0; i--) {
        r = overrides[i]
        rf = xelib.GetElementFile(r)
        fname = xelib.GetFileName(rf)
        if (visuals.includes(fname)) {
            return r;
        }
    }
    return undefined;
}

function copyFromVisual(record, visual, path) {
    prev = xelib.GetValue(visual, path);
    if (prev) {
        xelib.SetValue(record, path, prev)
    }
}

registerPatcher({
    info: info,
    gameModes: [xelib.gmTES5, xelib.gmSSE],
    settings: {
        label: 'NPC VisualTransfer',
        hide: true
    },
    getFilesToPatch: function(filenames) {
        return filenames;
    },
    execute: (patchFile, helpers, settings, locals) => ({
        initialize: function() {
            locals.visual_data = {}
        },
        process: [{
            load: {
                signature: 'NPC_',
                filter: function(record) {
                    p = findVisuals(record);
                    return p !== undefined
                }
            },
            patch: function(record) {
                helpers.logMessage(`Processing visual transfer for ${xelib.LongName(record)}`);
                visual = findVisuals(record);
                // copyFromVisual(record, visual, 'WNAM - Worn Armor')
                copyFromVisual(record, visual, 'Head Parts\\')
                copyFromVisual(record, visual, 'HCLF - Hair Color')
                copyFromVisual(record, visual, 'NAM5 - Unknown')
                copyFromVisual(record, visual, 'NAM6 - Height')
                copyFromVisual(record, visual, 'NAM7 - Weight')
                copyFromVisual(record, visual, 'DOFT - Default outfit')
                copyFromVisual(record, visual, 'SOFT - Sleeping outfit')
                copyFromVisual(record, visual, 'QNAM - Texture lighting\\Red')
                copyFromVisual(record, visual, 'QNAM - Texture lighting\\Green')
                copyFromVisual(record, visual, 'QNAM - Texture lighting\\Blue')
                copyFromVisual(record, visual, 'NAM9 - Face morph\\Nose Long/Short')
                copyFromVisual(record, visual, 'NAM9 - Face morph\\Nose Up/Down')
                copyFromVisual(record, visual, 'NAM9 - Face morph\\Jaw Up/Down')
                copyFromVisual(record, visual, 'NAM9 - Face morph\\Jaw Narrow/Wide')
                copyFromVisual(record, visual, 'NAM9 - Face morph\\Jaw Farward/Back')
                copyFromVisual(record, visual, 'NAM9 - Face morph\\Cheeks Up/Down')
                copyFromVisual(record, visual, 'NAM9 - Face morph\\Cheeks Farward/Back')
                copyFromVisual(record, visual, 'NAM9 - Face morph\\Eyes Up/Down')
                copyFromVisual(record, visual, 'NAM9 - Face morph\\Brows Up/Down')
                copyFromVisual(record, visual, 'NAM9 - Face morph\\Lips Up/Down')
                copyFromVisual(record, visual, 'NAM9 - Face morph\\Chin Narrow/Wide')
                copyFromVisual(record, visual, 'NAM9 - Face morph\\Chin Up/Down')
                copyFromVisual(record, visual, 'NAM9 - Face morph\\Chin Underbite/Overbite')
                copyFromVisual(record, visual, 'NAM9 - Face morph\\Eyes Farward/Back')
                copyFromVisual(record, visual, 'NAM9 - Face morph\Unknown')
                copyFromVisual(record, visual, 'NAMA - Face parts')
                copyFromVisual(record, visual, 'Tint Layers')
            }
        }]
    })
});