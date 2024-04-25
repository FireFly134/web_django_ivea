from db_utils import engine

import pandas as pd

from tqdm import tqdm


info = pd.read_sql_query("SELECT * FROM documents ORDER BY id DESC;", engine)
info2 = pd.read_sql_query("SELECT * FROM doc_date ORDER BY id ASC;", engine)

list_short_name = info["short_name"].to_list()
for short_name in tqdm(list_short_name):
    document_id_df = info[info["short_name"] == short_name]
    if len(document_id_df) > 1:
        print(short_name)
    for idx, row in document_id_df.iterrows():
        document_id = row["id"]
    info3 = info2[info2["doc_name"] == short_name]
    i = 0
    for idx, row in info3.iterrows():
        i += 1
        engine.execute(
            f"UPDATE doc_date SET npp='{i}',\
                  document_id='{document_id}' WHERE id='{row['id']}';"
        )

"""
document_id - где пустые надо заполнить
npp - сейчас главная задача \
    отсортировать по данному значению 1234,12,123... в каждом договоре
 """
