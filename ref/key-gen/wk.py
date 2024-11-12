#!/usr/bin/env python

import sys

if __name__ == '__main__':
    infile = open(sys.argv[1], 'r')
    outfile = open('WellKnownKeys.d', 'w')
    for line in infile:
        if line.startswith('///') :
            outfile.write(line);
            pos = line.find('22')
            if pos > 0 :
                name_start = line.find(':')
                name = line[name_start + 2 : pos]
                line = infile.readline();
                if line != "" :
                    # cut middle
                    mid_idx = line.find('),')
                    new_line = line[0 : mid_idx]
                    new_line += ', \"' + name.lower()  + '\"'
                    new_line += line[mid_idx:]
                    outfile.write(new_line);
        else:
            outfile.write(line);

