import struct

def generateSwapTable(seed):
    a = 6 + (seed % 250)
    b = seed / 250
    table = (range(0, 256), range(0, 256))
    for i in range(1, 10001):
        j = 1 + ((i * a + b) % 254)
        print "before",table[0][j],table[0][j + 1]
        table[0][j], table[0][j + 1] = table[0][j + 1], table[0][j]
        print "after",table[0][j],table[0][j + 1]

    for i in range(1, 256):
        table[1][table[0][i]] = i
    return table

def deobfuscate(stin, stout):
    stout.write(stin.read(8))
    junk = struct.unpack('<II', stin.read(8))
    stin.seek(4 * junk[0], 1)
    (seed,) = struct.unpack('<I', stin.read(4))
    table = generateSwapTable(seed)
    print "Seed:",seed
    stin.seek(4 * junk[1], 1)
    stout.write(stin.read(1))
    while True:
        b = stin.read(1)
        if len(b) == 0:
            break
        stout.write(chr((table[1][ord(b)] - stin.tell() + 1) & 0xFF))

f = open("./tests/gm_files/fire_example.gmk", "rb")
outfile= open("./tests/gm_files/fire_example.gmu2", "wb")
try:
    deobfuscate(f,outfile)
finally:
    f.close()
    outfile.close()