export const pageOrder = [
  'cover',
  'invite',
  'groom',
  'bride',
  'story',
  'schedule',
  'gallery',
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
  dressCode: '浅色礼服即可，请避开全白',
  countdownNote: '愿你出席，见证这个日子',
  amapUrl: 'https://uri.amap.com/marker?position=121.492944,31.245426&name=上海外滩茂悦大酒店',
  appleMapUrl: 'https://maps.apple.com/?ll=31.245426,121.492944&q=上海外滩茂悦大酒店',
  geoUrl: 'geo:31.245426,121.492944?q=上海外滩茂悦大酒店',
  coverPhoto: { id: 'cover', label: '封面照片', ratio: 'portrait' },
  inviteLines: ['谨订于', '二〇二六年十月十八日', '恭备薄酌', '敬请光临'],
  invitePhoto: { id: 'invite', label: '邀请函配图', ratio: 'landscape' },
  groom: {
    role: '新郎',
    name: '陈予安',
    line: '把日子过成想一起走的路',
    photo: { id: 'groom', label: '新郎肖像', ratio: 'portrait' },
    side: 'left',
  },
  bride: {
    role: '新娘',
    name: '林知夏',
    line: '遇见你之后，寻常日子也发光',
    photo: { id: 'bride', label: '新娘肖像', ratio: 'portrait' },
    side: 'right',
  },
  story: [
    { date: '2020.05', title: '初见', text: '一场朋友的晚饭', photo: { id: 'story-1', label: '初见', ratio: 'square' } },
    { date: '2022.09', title: '确定', text: '在江边说好以后', photo: { id: 'story-2', label: '确定', ratio: 'square' } },
    { date: '2026.10', title: '成礼', text: '请你来吃这顿饭', photo: { id: 'story-3', label: '成礼', ratio: 'square' } },
  ],
  schedule: [
    { time: '10:30', title: '迎宾' },
    { time: '11:18', title: '仪式' },
    { time: '12:00', title: '午宴' },
    { time: '14:00', title: '合影送客' },
  ],
  gallery: ['照片一', '照片二', '照片三', '照片四', '照片五', '照片六'].map((label, index) => ({
    id: `gallery-${index + 1}`,
    label,
    ratio: 'portrait',
  })),
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
    case 'groom':
      return invitation.groom
    case 'bride':
      return invitation.bride
    case 'story':
      return { beats: invitation.story }
    case 'schedule':
      return { items: invitation.schedule }
    case 'gallery':
      return { photos: invitation.gallery }
    case 'info':
      return {
        ceremonyDisplay: invitation.ceremonyDisplay,
        venueName: invitation.venueName,
        hallName: invitation.hallName,
        address: invitation.address,
        dressCode: invitation.dressCode,
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
