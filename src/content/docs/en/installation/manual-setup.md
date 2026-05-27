# Manual Setup

To use Backstitch in a custom project without the launcher, extra setup is needed.

1. Visit the [latest release of Backstitch](https://github.com/inkandswitch/backstitch/releases/latest), and download:
   - Our custom fork of Godot, `godot-with-backstitch`, for your platform:
     - [Windows](https://github.com/inkandswitch/backstitch/releases/latest/download/godot-with-backstitch-windows.zip)
     - [Linux](https://github.com/inkandswitch/backstitch/releases/latest/download/godot-with-backstitch-linux.zip)
     - [macOS](https://github.com/inkandswitch/backstitch/releases/latest/download/godot-with-backstitch-macos.zip)
   - Backstitch itself, as `backstitch`
     - [Backstitch](https://github.com/inkandswitch/backstitch/releases/latest/download/backstitch.zip)
2. Unzip the downloaded `backstitch` into your project, in the addons file.
   - Your project should look like `<root>/addons/backstitch/(... Backstitch.gdextension and other files)`
3. Run the custom fork of Godot, navigate to your project, and open it.
