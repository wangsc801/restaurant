from datetime import datetime, timedelta
from mongo_db_connection import connection  # 引用 connection 函数
import pytz

def get_total_sum_today(db_info_path):
    # 获取 MongoDB 数据库连接
    db = connection(db_info_path)

    # 获取今天的日期范围
    today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)

    gmt_timezone = pytz.timezone('GMT')

    today_start_gmt = today_start.astimezone(gmt_timezone)
    today_end_gmt = today_end.astimezone(gmt_timezone)

    # 定义聚合查询
    pipeline = [
        {
            "$match": {
                "orderedAt": {
                    "$gte": today_start_gmt,
                    "$lt": today_end_gmt
                }
            }
        },
        {
            "$group": {
                "_id": None,
                "totalSum": {"$sum": "$total"}
            }
        }
    ]
    # 执行查询
    result = list(db.order_records.aggregate(pipeline))
    print(result)
    # 返回结果
    if result:
        return result[0]["totalSum"]
    else:
        return 0  # 如果没有匹配的文档，返回 0

if __name__ == "__main__":
    db_info_path = "db_info.json"
    total_sum = get_total_sum_today(db_info_path)
    print(f"今天的 total 总和为: {total_sum}")