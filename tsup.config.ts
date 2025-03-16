// tsup.config.ts
import { defineConfig } from 'tsup'
import * as preset from 'tsup-preset-solid'

const preset_options: preset.PresetOptions = {
    entries: [
        {
            entry: 'src/index.tsx',
            dev_entry: false,
            server_entry: false,
        }
    ],
    drop_console: true,
    cjs: true, // Keep CommonJS for backward compatibility
}

export default defineConfig(config => {
    const watching = !!config.watch

    const parsed_data = preset.parsePresetOptions(preset_options, watching)

    const tsup_options = preset.generateTsupOptions(parsed_data)

    // Add additional configuration
    for (const config of tsup_options) {
        config.external = ['solid-js']
        config.treeshake = true
        config.sourcemap = true
        config.dts = true
    }

    if (!watching) {
        const package_fields = preset.generatePackageExports(parsed_data)

        console.log(`\npackage.json: \n${JSON.stringify(package_fields, null, 2)}\n\n`)

        preset.writePackageJson(package_fields)
    }

    return tsup_options
}) 