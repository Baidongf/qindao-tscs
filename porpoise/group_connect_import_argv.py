#!/usr/bin/python
# -*- coding:utf-8 -*-
import sys
import redis
import json
import urllib2

'''
group_dir = "./goodReputationLinks_level2.txt"
redis_host = "web1"
redis_port = 30768
redis_password = 'C10B8E@cd2'
'''

key_collection = "guarantee" # 正向映射表名 key -> name
reverse_collection = "guarantee_reverse" #反向映射表名 name -> key
path_collection = "path" #path路径保存
count_collection = "count" # 记录各种类型担保边的数量

def main(group_dir, redis_host, redis_port, redis_password):
    print "开始解析簇文件"
    txt = open(group_dir)
    # db=1 压测数据；db=2 测试数据
    r = redis.Redis(host = redis_host, port = redis_port, db=2,  password=redis_password)
    r.flushdb()
    #r.delete(key_collection)
    #r.delete(reverse_collection)
    #r.delete(path_collection)
    j = 0
    for line in txt:
        j = j + 1
        print (j)
        # set group hashmap
        i = json.loads(line)
        k = i.get('id', None)
        if k is not None:
            r.hset(key_collection, k, line)
            v_path = i['path']
            for edge in v_path:
                r.hset(reverse_collection, edge['_from'], k)
                r.hset(reverse_collection, edge['_to'], k)
    txt.close()
    print "解析簇文件结束，开始解析路径文件"
    txt = open(path_dir)
    j = 0
    count = {}
    # '{"id": "", "type":"guarantee_chain","path":[{"id":"xxx", "from":"A102","to":"A103"},{"id": "xxx","from": "A103","to": "A105"}]}'
    for line in txt:
        j = j + 1
        i = json.loads(line)
        print (j)
        # 统计边类型数
        count[i['type']] = count[i['type']] + 1 if i['type'] in count else 0
        # 设置路径的hashmap
        k = j
        r.hset(path_collection, k, line)
        v_path = i['path']
        for edge in v_path:
            r.sadd(edge['_from'], k)
            r.sadd(edge['_to'], k)
    txt.close()
    r.set(count_collection, json.dumps(count))
    print "finish!"

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print >>sys.stderr, 'excute like this: %s <group_dir> <path_dir> <redis_host> <redis_port> <redis_password>' % sys.argv[0]
        exit(0)
    group_dir = sys.argv[1] 
    path_dir = sys.argv[2] 
    redis_host = sys.argv[3]
    redis_port = sys.argv[4]
    redis_password = sys.argv[5] if len(sys.argv) == 6 else ''
    main(group_dir, redis_host, redis_port, redis_password)
