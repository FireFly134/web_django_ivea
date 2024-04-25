from typing import Any

units = (
    "ноль",
    ("один", "одна"),
    ("два", "две"),
    "три",
    "четыре",
    "пять",
    "шесть",
    "семь",
    "восемь",
    "девять",
)

teens = (
    "десять",
    "одиннадцать",
    "двенадцать",
    "тринадцать",
    "четырнадцать",
    "пятнадцать",
    "шестнадцать",
    "семнадцать",
    "восемнадцать",
    "девятнадцать",
)

tens = (
    teens,
    "двадцать",
    "тридцать",
    "сорок",
    "пятьдесят",
    "шестьдесят",
    "семьдесят",
    "восемьдесят",
    "девяносто",
)

hundreds = (
    "сто",
    "двести",
    "триста",
    "четыреста",
    "пятьсот",
    "шестьсот",
    "семьсот",
    "восемьсот",
    "девятьсот",
)

orders = (
    (("тысяча", "тысячи", "тысяч"), "f"),
    (("миллион", "миллиона", "миллионов"), "m"),
    (("миллиард", "миллиарда", "миллиардов"), "m"),
)

minus = "минус"


def thousand(rest: Any, sex: Any) -> Any:
    prev = 0
    plural = 2
    name = []
    use_teens = 10 <= rest % 100 <= 19
    if not use_teens:
        data = ((units, 10), (tens, 100), (hundreds, 1000))
    else:
        data = ((teens, 10), (hundreds, 1000))  # type: ignore
    for names, x in data:
        cur = int(((rest - prev) % x) * 10 / x)
        prev = rest % x
        if x == 10 and use_teens:
            plural = 2
            name.append(teens[cur])
        elif cur == 0:
            continue
        elif x == 10:
            name_ = names[cur]
            if isinstance(name_, tuple):
                name_ = name_[0 if sex == "m" else 1]
            name.append(name_)  # type: ignore
            if 2 <= cur <= 4:
                plural = 1
            elif cur == 1:
                plural = 0
            else:
                plural = 2
        else:
            name.append(names[cur - 1])  # type: ignore
    return plural, name


def num2text(num: Any, main_units: Any = (("", "", ""), "m")) -> Any:
    _orders = (main_units,) + orders
    if num == 0:
        return " ".join((units[0], _orders[0][0][2])).strip()  # ноль

    rest = abs(num)
    ord_ = 0
    name = []
    while rest > 0:
        plural, nme = thousand(rest % 1000, _orders[ord_][1])
        if nme or ord_ == 0:
            name.append(_orders[ord_][0][plural])
        name += nme
        rest = int(rest / 1000)
        ord_ += 1
    if num < 0:
        name.append(minus)
    name.reverse()
    return " ".join(name).strip()
