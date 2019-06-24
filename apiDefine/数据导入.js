/**
 * 1.(url不变)
 * @desc 获取导入任务列表
 *
 */

url: /api/fileInbound/list?page=0&size=10
  type: get
payload:{
  "data":[{
    "id":109,
    "fileName":"test_call",
    "fileUrl":"/home/wuhaiying/test/poc_demo/jss-call.txt",
    "description":"","fileSize":"780B","totalLine":2,
    "status":3,
    "lastModify":1500000349405,
    "statusLabel":"接入失败",
    "failExe":null,
    "fileType":CSV,
    "graph":"wangshan",
    "schema":"Company",
    "dataType":"relationship_data",
    "createTimeLabel":"一小时前",
    "createdBy":1100781,
    "createdDt":1514358994000,
    "updatedBy":1100781,
    "updatedDt":1514948628000,
    "progressLabel":"0%",
    "inboundStatisticses":[
      "successCount":8,
      "failCount":7,
      "createdBy":1100781,
      "createdDt":1514358994000,
      "updatedBy":1100781,
      "updatedDt":1514948628000,
      "statusLabel":"失败",
      "progressLabel":"50%",
    ],
}],
  "total":7,
    "page":0,
    "size":10
}

/**
 * 2.（完全没变）
 * @desc 删除导入任务
 *
 */
url: /api/fileInbound/deletion?fileInboundId=2323
  type: delete
  payload:{
}

/**
 * 3.
 * @desc 重新导入
 *
 */
url: /api/fileInbound/regain?fileInboundId=2323&startLine=323
  type: post
payload: {
}

/**
 * 4.
 * @desc 续传
 *
 *
 */
url: /api/fileInbound/continue?fileInboundId=2323&startLine=323
  type: post
payload: {
}

/**
 * 5.（完全没变）
 * @desc 创建和编辑任务
 *
 */
url:/api/fileInbound/save
type: post
body: fileInbound: {
  "fileName":"公司信息",
    "fileUrl":"/home/work/appp/aa.csv",
    "description":"",
    "failExe":null,
    "FileType":"CSV",
    "graph":"wangshan",
    "schema":"Company",
}
payload:{}

/**
 * 6.
 * @desc 任务文件是否已修改
 *
 */
url: /api/fileInbound/isChanged?fileInboundId=2323
  type: get,
  payload:{
  isChanged: true/false
}

/**
 * 7.
 * @desc 任务详情
 *
 */
url:  /api/fileInbound/taskDetails?fileInboundId=2323
  type: get,
  payload: {
    "fileName":"公司信息",
    "fileUrl":"/home/work/appp/aa.csv",
    "description":"",
    "failExe":null,
    "FileType":"CSV",
    "graph":"wangshan",
    "schema":"Company",
    "createTimeLabel":"一小时前",
    "createdBy":1100781,
    "createdDt":1514358994000,
    "updatedBy":1100781,
    "updatedDt":1514948628000,
}

/**
 * 8.
 * @desc  导入详情
 *
 */
url: /api/fileInbound/inboundDetails?fileInboundId=2323
  type: get,
  payload: {
  data: [
    {name: '第一次导入',
      totalLine: 180000,
      fileSize:'10G',
      fileInboundId:23,
      id:67,
      parts: [
        {name: '第一部分',
          id:67,
          batchId:78,
          startLine: 0,
          endLine: 2323,
          startTime: 4374343434343434,
          progressLabel: '80%',
          dbList: [
            {name: 'arrange DB', successCount: 60, failCount: 100, progressLabel: '60%',id:producer_id:78},
            {name: 'ES', successCount: 60, failCount: 100, progressLabel: '60%',producer_id:89},
            {name: 'Hbase', successCount: 60, failCount: 100, progressLabel: '60%',producer_id:90}
          ]
        }
      ]
    }
  ]
}
