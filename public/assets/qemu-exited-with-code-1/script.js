(function () {
  const scenarios = {
    lock: {
      output: 'TASK ERROR: start failed: QEMU exited with code 1\nqemu: Failed to get "write" lock\nIs another process using the image?',
      title: 'The disk image is already open or still locked by another process.',
      copy: 'This usually happens after a stuck backup, migration, previous QEMU process, storage hiccup, or duplicate start. Do not repair the disk while something may still hold it.',
      commands: 'qm status 101\nqm config 101\nps -ef | grep \"[q]emu-system.*101\"\nlsof | grep \"vm-101-disk\"',
      fix: 'Confirm no backup, migration, or QEMU process is active. Only then clear stale Proxmox locks or stop the stale process through the safest control path.',
    },
    storage: {
      output: 'TASK ERROR: start failed: QEMU exited with code 1\nstorage is not online\nor no space left on device',
      title: 'QEMU cannot open the VM disk because storage is unavailable or full.',
      copy: 'The generic exit code hides the real storage error. Check the Proxmox storage layer first: local-lvm, ZFS, Ceph, NFS, iSCSI, or directory storage.',
      commands: 'pvesm status\ndf -h\nzpool status\nceph -s\njournalctl -u pvestatd --since \"15 min ago\"',
      fix: 'Restore the storage mount/pool, free space, fix Ceph/ZFS/NFS health, then start the VM again. Avoid editing VM config before proving storage health.',
    },
    config: {
      output: 'TASK ERROR: start failed: QEMU exited with code 1\ncould not open disk image\nbridge vmbr1 does not exist',
      title: 'The VM configuration points to something QEMU cannot use.',
      copy: 'Bad disk paths, missing ISO files, removed bridges, invalid machine type, bad boot order, or stale cloud-init devices can all surface as code 1.',
      commands: 'qm config 101\nqm status 101\npvesm status\njournalctl -u pvedaemon --since \"15 min ago\"',
      fix: 'Fix the missing disk, ISO, storage, network bridge, or VM option. Then rerun the same start operation and compare the task log.',
    },
    kvm: {
      output: 'TASK ERROR: start failed: QEMU exited with code 1\nKVM acceleration cannot be used\nfailed to initialize kvm',
      title: 'The host cannot provide KVM acceleration to this VM.',
      copy: 'This points to disabled virtualization in BIOS/UEFI, missing KVM modules, nested virtualization mismatch, or host kernel issues.',
      commands: 'egrep -o \"vmx|svm\" /proc/cpuinfo | head\nlsmod | grep kvm\ndmesg | grep -i kvm\njournalctl -k --since \"15 min ago\"',
      fix: 'Enable Intel VT-x/AMD-V, load the right kvm module, fix nested virtualization if needed, and verify the host before changing the guest.',
    },
    passthrough: {
      output: 'TASK ERROR: start failed: QEMU exited with code 1\nvfio: device is already attached\nor failed to setup passthrough device',
      title: 'A passed-through GPU, PCI, USB, or disk device is busy or misbound.',
      copy: 'Passthrough failures often happen after host reboots, driver updates, another VM using the device, or IOMMU group changes.',
      commands: 'qm config 101 | grep -E \"hostpci|usb|serial|virtio\"\nlspci -nnk\ndmesg | grep -i vfio\njournalctl -k --since \"15 min ago\"',
      fix: 'Release the device, verify IOMMU/vfio binding, and confirm only one VM owns it. Do not keep retrying start if the host still owns the device.',
    },
    disk: {
      output: 'TASK ERROR: start failed: QEMU exited with code 1\nqcow2: Image is corrupt\nor could not read metadata',
      title: 'The disk image may be damaged — treat this as data-risk work.',
      copy: 'Disk repair is not a first move. Prove the VM is stopped, prove no QEMU process owns the image, take a backup or snapshot if possible, then check the image.',
      commands: 'qm status 101\nps -ef | grep \"[q]emu-system.*101\"\nqemu-img info /path/to/vm-101-disk-0.qcow2\nqemu-img check -f qcow2 /path/to/vm-101-disk-0.qcow2',
      fix: 'Prefer restore from a known-good backup. Use qemu-img repair options only after understanding the risk and only while the image is not in use.',
    },
  };

  const output = document.querySelector('[data-scenario-output]');
  const title = document.querySelector('[data-scenario-title]');
  const copy = document.querySelector('[data-scenario-copy]');
  const commands = document.querySelector('[data-scenario-commands]');
  const fix = document.querySelector('[data-scenario-fix]');
  const tabs = Array.from(document.querySelectorAll('[data-scenario]'));

  function activateScenario(key) {
    const scenario = scenarios[key] || scenarios.lock;
    if (output) output.textContent = scenario.output;
    if (title) title.textContent = scenario.title;
    if (copy) copy.textContent = scenario.copy;
    if (commands) commands.textContent = scenario.commands;
    if (fix) fix.textContent = scenario.fix;

    tabs.forEach((tab) => {
      const active = tab.getAttribute('data-scenario') === key;
      tab.classList.toggle('isActive', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activateScenario(tab.getAttribute('data-scenario')));
  });

  document.querySelectorAll('.faqQuestion').forEach((button) => {
    button.addEventListener('click', () => {
      const answer = button.parentElement && button.parentElement.querySelector('.faqAnswer');
      const chevron = button.querySelector('.faqChevron');
      const nextExpanded = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', nextExpanded ? 'true' : 'false');
      if (answer) answer.hidden = !nextExpanded;
      if (chevron) chevron.classList.toggle('faqChevronOpen', nextExpanded);
    });
  });
})();
