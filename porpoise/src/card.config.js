export const caseMap = {
    judgeWenshuMap: {
        '标题': 'case_name',
        '案号': 'case_id',
        '案由': 'case_cause',
        '判决结果': 'judge_content',
        '判决时间': 'case_date'
    },
    judgeProcessMap: {
        '案号': 'case_id',
        '立案时间': 'filing_date',
        '开庭时间': 'court_time',
        '案件状态': 'status'
    },
    courtBulletinDoc: {
        '标题': ['title', 'case_id'],
        '开庭时间': ['court_time', 'bulletin_date'],
        '案号': 'case_id',
        '内容': 'content'
    },
    courtAnnounceDoc: {
        '案号': 'case_id',
        '公告日期': 'bulletin_date',
        '公告内容': ['norm_bulletin_content', 'bulletin_content']
    },
    bidDetail: {
        '标题': 'title',
        '发布日期': 'publish_time',
        '所属城市': 'city',
        '详情': 'bid_content'
    }
}

export const caseTypeMap = {
    /** arango 中已经没有这五种实体了，但是为了代码兼容，仍保留 */
    'Judgement_wenshu': { collection: 'judgement_wenshu', title: '裁判文书', map: 'judgeWenshuMap' },
    'Judge_process': { collection: 'judge_process', title: '审判流程', map: 'judgeProcessMap' },
    'Court_bulletin_doc': { collection: 'court_ktgg', title: '开庭公告', map: 'courtBulletinDoc' },
    'Court_announcement_doc': { collection: 'bulletin', title: '法院公告', map: 'courtAnnounceDoc' },
    'Bid_detail': { collection: 'bid_detail', title: '标书', map: 'bidDetail' },
    /** 为保证兼容性，仍采用首字母大写 */
    'Court_ktgg': { collection: 'court_ktgg', title: '开庭公告', map: 'courtBulletinDoc' },
    'Bulletin': { collection: 'bulletin', title: '法院公告', map: 'courtAnnounceDoc' },
}