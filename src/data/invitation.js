export const pageOrder = [
  'cover',
  'invite',
  'photo-1',
  'photo-2',
  'photo-3',
  'photo-4',
  'info',
  'countdown',
  'map',
]

export const invitation = {
  brideName: '林知夏',
  groomName: '陈予安',
  dateLabel: '2026.10.18',
  ceremonyIso: '2026-10-18T11:18:00+08:00',
  ceremonyDisplay: '2026年10月18日 11:18',
  venueName: '上海外滩茂悦大酒店',
  hallName: '浦江厅',
  address: '上海市虹口区黄浦路199号',
  latitude: 31.245426,
  longitude: 121.492944,
  countdownNote: '愿你出席，见证这个日子',
  amapUrl: 'https://uri.amap.com/marker?position=121.492944,31.245426&name=上海外滩茂悦大酒店',
  appleMapUrl: 'https://maps.apple.com/?ll=31.245426,121.492944&q=上海外滩茂悦大酒店',
  geoUrl: 'geo:31.245426,121.492944?q=上海外滩茂悦大酒店',
  coverPhoto: { id: 'cover', label: '封面照片', ratio: 'portrait' },
  inviteLines: ['谨订于', '二〇二六年十月十八日', '恭备薄酌', '敬请光临'],
  invitePhoto: { id: 'invite', label: '邀请函配图', ratio: 'landscape' },
  photos: [
    {
      id: 'photo-1',
      label: '照片一',
      ratio: 'portrait',
      motion: 'fly-left',
      icon: 'ring',
      kicker: '此刻',
      title: '相视一笑',
      line: '把今天留给你们',
    },
    {
      id: 'photo-2',
      label: '照片二',
      ratio: 'portrait',
      motion: 'fly-right',
      icon: 'heart',
      kicker: '并肩',
      title: '一路同行',
      line: '风也停在这一页',
    },
    {
      id: 'photo-3',
      label: '照片三',
      ratio: 'portrait',
      motion: 'fly-up',
      icon: 'bloom',
      kicker: '光阴',
      title: '寻常闪光',
      line: '日子因此变得好看',
    },
    {
      id: 'photo-4',
      label: '照片四',
      ratio: 'portrait',
      motion: 'fly-down',
      icon: 'star',
      kicker: '此生',
      title: '请来看看',
      line: '我们把座位留给你',
    },
  ],
}

export function propsFor(id) {
  switch (id) {
    case 'cover':
      return {
        brideName: invitation.brideName,
        groomName: invitation.groomName,
        dateLabel: invitation.dateLabel,
        photo: invitation.coverPhoto,
      }
    case 'invite':
      return { lines: invitation.inviteLines, photo: invitation.invitePhoto }
    case 'photo-1':
    case 'photo-2':
    case 'photo-3':
    case 'photo-4':
      return { photo: invitation.photos.find((item) => item.id === id) }
    case 'info':
      return {
        ceremonyDisplay: invitation.ceremonyDisplay,
        venueName: invitation.venueName,
        hallName: invitation.hallName,
        address: invitation.address,
      }
    case 'countdown':
      return {
        ceremonyIso: invitation.ceremonyIso,
        note: invitation.countdownNote,
        invalidLabel: invitation.ceremonyDisplay,
      }
    case 'map':
      return {
        venueName: invitation.venueName,
        hallName: invitation.hallName,
        address: invitation.address,
        amapUrl: invitation.amapUrl,
        appleMapUrl: invitation.appleMapUrl,
        geoUrl: invitation.geoUrl,
      }
  }
}

export function systemMapUrl(userAgent) {
  if (/iPhone|iPad/.test(userAgent)) return invitation.appleMapUrl
  return invitation.geoUrl
}
