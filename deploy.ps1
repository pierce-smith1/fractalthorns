remove-item -recurse ./fractalthorns/dist

npm --prefix ./fractalthorns run build
if ($lastexitcode -ne 0) {
    exit
}

npm ci
if ($lastexitcode -ne 0) {
    exit
}

ssh beryl@fractalthorns.com "sudo systemctl stop rva"

rclone sync ./fractalthorns/dist maxixe:/home/web/host/rva/fractalthorns/dist
scp -r ./fractalthorns/package.json beryl@fractalthorns.com:/home/web/host/rva/fractalthorns

rclone sync ./fractalthorns/_content/authorland maxixe:/home/web/host/rva/_content/authorland
scp -r package.json beryl@fractalthorns.com:/home/web/host/rva
scp -r main.js beryl@fractalthorns.com:/home/web/host/rva

ssh beryl@fractalthorns.com "sudo systemctl start rva"