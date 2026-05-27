# Configuración manual

Para usar Backstitch en un proyecto personalizado sin el launcher, hace falta una configuración adicional.

1. Visita la [última versión de Backstitch](https://github.com/inkandswitch/backstitch/releases/latest) y descarga:
   - Nuestra bifurcación personalizada de Godot, `godot-with-backstitch`, para tu plataforma:
     - [Windows](https://github.com/inkandswitch/backstitch/releases/latest/download/godot-with-backstitch-windows.zip)
     - [Linux](https://github.com/inkandswitch/backstitch/releases/latest/download/godot-with-backstitch-linux.zip)
     - [macOS](https://github.com/inkandswitch/backstitch/releases/latest/download/godot-with-backstitch-macos.zip)
   - Backstitch propiamente dicho, como `backstitch`
     - [Backstitch](https://github.com/inkandswitch/backstitch/releases/latest/download/backstitch.zip)
2. Descomprime el `backstitch` descargado dentro de tu proyecto, en la carpeta addons.
   - Tu proyecto debería verse como `<raíz>/addons/backstitch/(... Backstitch.gdextension y otros archivos)`
3. Ejecuta la bifurcación personalizada de Godot, navega hasta tu proyecto y ábrelo.
