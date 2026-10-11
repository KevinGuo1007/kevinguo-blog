---
title: '在双系统中将 Windows 下的磁盘分区挂载为 Linux 系统的硬盘'
description: '捣鼓 Arch Linux'
slug: linux-add-second-disk
date: "2025-10-28"
tags: ['arch-linux', 'configuration', 'linux']
featured: false
draft: false
---

::note

最近在我的笔记本上配置好了自己的 Arch Linux 和 Windows 的双系统，但是 Linux 的系统盘当时只分配了128G，后面由于要跑机器学习的代码和数据集，于是想要将自己另外一块之前在 Windows 上使用的固态硬盘的一部分挂载到 Linux 系统下进行使用。
::



1. 先查看当前设备中各硬盘的挂载情况：

   ```bash
   lsblk
   ```

   ![](https://raw.githubusercontent.com/KevinGuo1007/kevinguoinkimg/main/img/linux-add-second-disk-001.png)

2. 由于我在该块硬盘当中设置有两个 ntfs 分区，其中一个分区中有安装一些 Windows 下的软件，因此我需要先通过 ntfs3 对该分区进行挂载，确认一下哪个是我需要格式化挂载到 Linux 的磁盘分区：

   ```bash
   sudo mkdir -p /mnt/test1
   # 如果内核没有 ntfs3 驱动，可以换成 ntfs-3g
   sudo mount -t ntfs3 /dev/nvme0n1p2 /mnt/test1
   ls /mnt/test1
   ```

   确认找到对应磁盘分区后我们取消挂载，并删除创建的测试文件夹
   ![](https://cdn.jsdelivr.net/gh/KevinGuo1007/kevinguoinkimg@main/img/linux-add-second-disk-002.png)

3. 接下来我们使用 fdisk 进行分区和文件系统的调整：

   ```bash
   sudo fdisk /dev/nvme0n1p3
   # 输入 p 查看当前分区表。
   # 输入 d 删除不需要的分区。
   # 输入 n 新建分区（选择主分区或默认即可）。
   # 输入 w 保存并退出。
   ```

   ![](https://cdn.jsdelivr.net/gh/KevinGuo1007/kevinguoinkimg@main/img/linux-add-second-disk-003.png)

4. 格式化为 btrfs ：

   ```bash
   sudo mkfs.btrfs -f /dev/nvme0n1p3
   ```

   ![](https://cdn.jsdelivr.net/gh/KevinGuo1007/kevinguoinkimg@main/img/linux-add-second-disk-004.png)

5. 创建挂载点并挂载分区：

   ```bash
   # 注意这里的 dev 取名是可以自定义的
   sudo mkdir -p /mnt/dev
   sudo mount /dev/nvme0n1p3 /mnt/dev
   ```

   ![](https://cdn.jsdelivr.net/gh/KevinGuo1007/kevinguoinkimg@main/img/linux-add-second-disk-005.png)

6. 设置开机自动挂载

   ```bash
   # 获取该磁盘分区的 UUID
   blkid /dev/nvme0n1p3
   ```

   在`/etc/fstab`添加并保存：

   ```text
   UUID=xxxx-xxxx   /mnt/dev   btrfs   defaults   0  0
   ```

   ![](https://cdn.jsdelivr.net/gh/KevinGuo1007/kevinguoinkimg@main/img/linux-add-second-disk-006.png)

7. 完成并检查挂载情况：

   ```bash
   sudo mount -a
   df -h
   ```
   
   ![](https://cdn.jsdelivr.net/gh/KevinGuo1007/kevinguoinkimg@main/img/linux-add-second-disk-007.png)

---

::tip

这里有一个改进的建议，由于`/mnt`是通用的临时挂载点，不适合日常使用，因此我们将挂载点移动到`~/Development`目录下：

```bash
# 卸载旧挂载点
sudo umount /mnt/dev

# 创建对应文件夹，注意这个要改成自己的用户名
mkdir -p /home/kevinguo/Development
sudo mount /dev/nvme0n1p3 /home/kevinguo/Development

# 更新 /etc/fstab
sudo vim /etc/fstab

# 验证新配置
sudo mount -a
df -h

# 清理旧挂载点
sudo rmdir /etc/dev
```

![](https://cdn.jsdelivr.net/gh/KevinGuo1007/kevinguoinkimg@main/img/linux-add-second-disk-008.png)
::

