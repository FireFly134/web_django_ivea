from db_utils import engine

from django.http import HttpRequest, HttpResponse
from django.shortcuts import render

import pandas as pd


def index(request: HttpRequest) -> HttpResponse:
    return render(request, "ivea_station/index.html")


def check_station(request: HttpRequest) -> HttpResponse:
    info = pd.read_sql(
        "SELECT * FROM check_connect ORDER BY system_name ASC;", engine
    )
    info2 = pd.read_sql(
        "SELECT station_id FROM station_phase_mapping WHERE is_enabled = 1;",
        engine,
    )
    list_station = []
    list_station += [
        "IVEA" + str(info2.loc[i, "station_id"])
        for i in range(len(info2))
        if "IVEA" + str(info2.loc[i, "station_id"]) not in list_station
    ]
    station_id = []
    for i in range(len(info)):
        station_id.append(
            int(
                str(info.loc[i, "system_name"])
                .replace("IVEA", "")
                .replace("С", "")
            )
        )
    info["station_id"] = station_id
    info = info.sort_values(by="station_id")
    html = ""
    for idx, row in info.iterrows():
        if int(row["connect"]) >= 90 and row["system_name"] in list_station:
            connect = "🟩" + str(row["connect"]) + "%🟩"
        elif (
            int(row["connect"]) >= 55
            and int(row["connect"]) < 90
            and row["system_name"] in list_station
        ):
            connect = "🟨" + str(row["connect"]) + "%🟨"
        elif row["system_name"] in list_station:
            connect = "🟥" + str(row["connect"]) + "%🟥"
        else:
            connect = "⬜" + str(row["connect"]) + "%⬜"

        if (
            int(row["power_supply"]) >= 90
            and row["system_name"] in list_station
        ):
            power_supply = "🟩" + str(row["power_supply"]) + "%🟩\n"
        elif (
            int(row["power_supply"]) >= 55
            and int(row["power_supply"]) < 90
            and row["system_name"] in list_station
        ):
            power_supply = "🟨" + str(row["power_supply"]) + "%🟨\n"
        elif row["system_name"] in list_station:
            power_supply = "🟥" + str(row["power_supply"]) + "%🟥\n"
        else:
            power_supply = "⬜" + str(row["power_supply"]) + "%⬜\n"
        html += (
            """<tr>
                         <td style="text-align:center">\
                            <span style="font-size:12pt; color:black;\
                                  font-family:Calibri,sans-serif">"""
            + str(row["system_name"])
            + """</span></td>
                         <td style="text-align:center">\
                            <span style="font-size:12pt; color:black;\
                                  font-family:Calibri,sans-serif">"""
            + str(connect)
            + """</span></td>
                         <td style="text-align:center">\
                            <span style="font-size:12pt; color:black;\
                                  font-family:Calibri,sans-serif">"""
            + str(power_supply)
            + """</span></td>
                    </tr>"""
        )
    return render(
        request, "ivea_station/check_station.html", context={"table": html}
    )
