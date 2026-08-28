# Hosting a Server

As a more stable and secure alternative, you can host a Backstitch server on your local network, or on the open internet. Instructions can be found in the [Backstitch Sync Server](https://github.com/inkandswitch/backstitch-sync-server) repository. We provide a Docker image!

<div class="warning">

### Note

By default, the Backstitch Sync Server doesn't provide authentication. This means anyone can access your data, if they guess the Project ID. If you expose this server to the open internet, it is **highly recommended** to use a VPN tunnel with authentication of your choice, or another authentication scheme. Look into ZeroTier or Tailscale for free VPN tunnels.

Advanced users and organizations may alternatively use OpenID Connect authentication. Please visit the [Backstitch Sync Server](https://github.com/inkandswitch/backstitch-sync-server) repository for more details. 

</div>
