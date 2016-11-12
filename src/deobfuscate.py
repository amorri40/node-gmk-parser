import struct

def generateSwapTable(seed):
	a = 6 + (seed % 250)
	b = seed / 250
	table = (range(0, 256), range(0, 256))
	for i in range(1, 10001):
		j = 1 + ((i * a + b) % 254)
		table[0][j], table[0][j + 1] = table[0][j + 1], table[0][j]
	for i in range(1, 256):
		table[1][table[0][i]] = i
	return table

def deobfuscate(stin, stout):
    seed=16085
    table = generateSwapTable(seed)

    while True:
		b = stin.read(1)
		if len(b) == 0:
			break
		stout.write(chr((table[1][ord(b)] - stin.tell() + 1) & 0xFF))

f = open("./tests/gm_files/fire_example.gmk", "rb")
outfile= open("./tests/gm_files/fire_example.gmu", "wb")
try:
    deobfuscate(f,outfile)
finally:
    f.close()
    outfile.close()