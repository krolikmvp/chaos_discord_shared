# Python script responsible for creating message stats chart

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import sys


xs=sys.argv[1].split(',')
ys=sys.argv[2].split(',')

if sys.argv[3]:
    if sys.argv[3] =='month':
        suffix = ''
        x_label = 'Dzien'
    else:
        suffix =':00'
        x_label = 'Godzina'
else:
    suffix =':00'
    x_label = 'Godzina'

xs = [x + suffix for x in xs]
ys = [int(y) for y in ys]

fig, ax = plt.subplots()
ax.bar(xs,ys)
ax.set_ylabel('Wiadomosci')
ax.set_xlabel(x_label)

ax.set_ylabel('Wiadomosci')
plt.setp(ax.get_xticklabels(), rotation=90, horizontalalignment='right', fontsize='x-small')
plt.savefig('demo.png', bbox_inches='tight')
