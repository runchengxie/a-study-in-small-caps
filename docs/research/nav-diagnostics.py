#!/usr/bin/env python3
"""Descriptive diagnostics of a frozen public NAV; no holdings reconstruction.

Usage: python docs/research/nav-diagnostics.py INPUT_JSON OUTPUT_JSON
Python standard library only. Output paths must be explicitly supplied.
"""
import datetime as dt
import hashlib
import json
import math
from pathlib import Path
import statistics
import sys


def calculate(raw):
    rows = json.loads(raw)
    dates = [dt.date.fromisoformat(r['date']) for r in rows]
    nav = [float(r['nav']) for r in rows]
    assert len(rows) > 252 and all(a < b for a, b in zip(dates, dates[1:]))
    assert all(math.isfinite(x) and x > 0 for x in nav)
    returns = [b / a - 1 for a, b in zip(nav, nav[1:])]
    rolling = []
    for window in (21, 63, 126, 252):
        values = [nav[i] / nav[i-window] - 1 for i in range(window, len(nav))]
        low = min(range(len(values)), key=values.__getitem__)
        high = max(range(len(values)), key=values.__getitem__)
        rolling.append(dict(sessions=window, observations=len(values), minimum=values[low],
                            maximum=values[high], negativeFraction=sum(x < 0 for x in values)/len(values),
                            worstStart=dates[low].isoformat(), worstEnd=dates[low+window].isoformat(),
                            bestStart=dates[high].isoformat(), bestEnd=dates[high+window].isoformat()))
    peak = nav[0]
    peak_i = 0
    drawdowns = []
    episodes = []
    active = None
    for i, value in enumerate(nav):
        if value >= peak:
            if active is not None:
                active.update(recovery=dates[i].isoformat(), sessions=i-active.pop('peakIndex'), censored=False)
                episodes.append(active)
                active = None
            peak, peak_i = value, i
        dd = value/peak-1
        drawdowns.append(dd)
        if dd < 0:
            if active is None:
                active = dict(peak=dates[peak_i].isoformat(), peakIndex=peak_i, trough=dates[i].isoformat(), drawdown=dd)
            if dd < active['drawdown']:
                active.update(trough=dates[i].isoformat(), drawdown=dd)
    if active is not None:
        active.update(recovery=None, sessions=len(nav)-1-active.pop('peakIndex'), censored=True)
        episodes.append(active)
    annual=[]
    for year in sorted(set(d.year for d in dates)):
        idx=[i for i,d in enumerate(dates) if d.year==year]
        first,last=idx[0],idx[-1]
        base=max(0,first-1)
        annual.append(dict(year=year,start=dates[base].isoformat(),end=dates[last].isoformat(),
                           returnFraction=nav[last]/nav[base]-1,
                           partial=year in (dates[0].year,dates[-1].year)))
    logreturns=[math.log1p(x) for x in returns]
    best=sorted(range(len(returns)),key=returns.__getitem__,reverse=True)[:10]
    worst=sorted(range(len(returns)),key=returns.__getitem__)[:10]
    total=math.fsum(logreturns)
    return dict(schemaVersion=1, sourceSha256=hashlib.sha256(raw).hexdigest(),
                reviewedOn='2026-11-27',start=dates[0].isoformat(),end=dates[-1].isoformat(),
                navObservations=len(nav),returnObservations=len(returns),
                totalReturn=math.expm1(total),
                calendarCAGR=math.expm1(total/((dates[-1]-dates[0]).days/365.25)),
                annualizedVolatility=statistics.stdev(returns)*math.sqrt(252),
                maximumDrawdown=min(drawdowns),underwaterFraction=sum(x<0 for x in drawdowns)/len(nav),
                worstDailyReturn=min(returns),bestDailyReturn=max(returns),
                withoutBest10=math.expm1(total-math.fsum(logreturns[i] for i in best)),
                withoutWorst10=math.expm1(total-math.fsum(logreturns[i] for i in worst)),
                rolling=rolling,annual=annual,episodes=sorted(episodes,key=lambda x:x['drawdown'])[:8])


if __name__ == '__main__':
    source, target = map(Path, sys.argv[1:])
    target.write_text(json.dumps(calculate(source.read_bytes()), indent=2)+'\n')
