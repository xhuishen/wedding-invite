import { describe, expect, it } from 'vitest'
import { invitation, pageOrder, propsFor, systemMapUrl } from './invitation'

describe('invitation data', () => {
  it('keeps nine page ids in order', () => {
    expect(pageOrder).toEqual([
      'cover',
      'invite',
      'photo-1',
      'photo-2',
      'photo-3',
      'photo-4',
      'info',
      'countdown',
      'map',
    ])
  })

  it('uses the demo couple, venue, and map links', () => {
    expect(invitation.brideName).toBe('林知夏')
    expect(invitation.groomName).toBe('陈予安')
    expect(invitation.dateLabel).toBe('2026.10.18')
    expect(invitation.ceremonyIso).toBe('2026-10-18T11:18:00+08:00')
    expect(invitation.ceremonyDisplay).toBe('2026年10月18日 11:18')
    expect(invitation.venueName).toBe('上海外滩茂悦大酒店')
    expect(invitation.hallName).toBe('浦江厅')
    expect(invitation.address).toBe('上海市虹口区黄浦路199号')
    expect(invitation.latitude).toBe(31.245426)
    expect(invitation.longitude).toBe(121.492944)
    expect(invitation.amapUrl).toBe(
      'https://uri.amap.com/marker?position=121.492944,31.245426&name=上海外滩茂悦大酒店',
    )
    expect(invitation.appleMapUrl).toBe(
      'https://maps.apple.com/?ll=31.245426,121.492944&q=上海外滩茂悦大酒店',
    )
    expect(invitation.geoUrl).toBe('geo:31.245426,121.492944?q=上海外滩茂悦大酒店')
    expect(invitation.coverPhoto.src).toBeUndefined()
  })

  it('builds props for every page', () => {
    expect(propsFor('cover')).toMatchObject({
      brideName: '林知夏',
      groomName: '陈予安',
      dateLabel: '2026.10.18',
      photo: { id: 'cover', label: '封面照片', ratio: 'portrait' },
    })
    expect(propsFor('invite')).toMatchObject({
      lines: ['谨订于', '二〇二六年十月十八日', '恭备薄酌', '敬请光临'],
      photo: { id: 'invite', label: '邀请函配图', ratio: 'landscape' },
    })
    expect(propsFor('photo-1').photo).toMatchObject({
      id: 'photo-1',
      label: '照片一',
      motion: 'fly-left',
      icon: 'ring',
      title: '相视一笑',
    })
    expect(propsFor('photo-4').photo).toMatchObject({
      id: 'photo-4',
      label: '照片四',
      motion: 'fly-down',
      icon: 'star',
      title: '请来看看',
    })
    expect(propsFor('info')).toMatchObject({
      address: '上海市虹口区黄浦路199号',
    })
    expect(propsFor('info').dressCode).toBeUndefined()
    expect(propsFor('countdown')).toMatchObject({
      ceremonyIso: '2026-10-18T11:18:00+08:00',
      note: '愿你出席，见证这个日子',
      invalidLabel: '2026年10月18日 11:18',
    })
    expect(propsFor('map')).toMatchObject({
      venueName: '上海外滩茂悦大酒店',
      hallName: '浦江厅',
      amapUrl: invitation.amapUrl,
      appleMapUrl: invitation.appleMapUrl,
      geoUrl: invitation.geoUrl,
    })
  })

  it('picks apple maps only for iPhone and iPad', () => {
    expect(systemMapUrl('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)')).toBe(invitation.appleMapUrl)
    expect(systemMapUrl('Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)')).toBe(invitation.appleMapUrl)
    expect(systemMapUrl('Mozilla/5.0 (Linux; Android 14)')).toBe(invitation.geoUrl)
  })
})
