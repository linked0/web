#!/usr/bin/env python

import sys

start_key_data = """/// GENESIS: genesis1xrxydyju2h8l3sfytnwd3l8j4gj4jsa0wj4pykt37yyggtl686ugyrhdg2p
static immutable GenesisData = KeyData("genesis",
    Point([204, 70, 146, 92, 85, 207, 248, 193, 36, 92, 220, 216, 252, 242, 170, 37, 89, 67, 175, 116, 170, 18, 89, 113, 241, 8, 132, 47, 250, 62, 184, 130]),
    Scalar([57, 34, 14, 84, 18, 175, 101, 64, 121, 181, 212, 78, 23, 148, 180, 7, 9, 105, 237, 155, 78, 161, 191, 27, 97, 130, 209, 44, 202, 245, 208, 13]));

/// COMMONS BUDGET: commons1xrzwvvw6l6d9k84ansqgs9yrtsetpv44wfn8zm9a7lehuej3ssskxywrcal
static immutable CommonsBudgetData = KeyData("commons",
    Point([196, 230, 49, 218, 254, 154, 91, 30, 189, 156, 0, 136, 20, 131, 92, 50, 176, 178, 181, 114, 102, 113, 108, 189, 247, 243, 126, 102, 81, 132, 33, 99]),
    Scalar([177, 62, 40, 215, 115, 236, 122, 8, 22, 109, 42, 57, 44, 73, 121, 175, 60, 1, 135, 69, 17, 1, 104, 238, 0, 153, 89, 28, 249, 67, 42, 7]));

/// NODE2: node21xrdwry6fpk7a57k4gwyj3mwnf59w808nygtuxsgdrpmv4p7ua2hqx277esm
static immutable NODE2Data = KeyData("node2",
    Point([218, 225, 147, 73, 13, 189, 218, 122, 213, 67, 137, 40, 237, 211, 77, 10, 227, 188, 243, 34, 23, 195, 65, 13, 24, 118, 202, 135, 220, 234, 174, 3]),
    Scalar([235, 179, 46, 185, 245, 191, 31, 208, 161, 209, 24, 204, 112, 33, 42, 108, 209, 64, 61, 44, 197, 122, 48, 125, 200, 139, 49, 146, 185, 206, 227, 13]));

/// NODE3: node31xrdwrymw40ae7kdumk5uf24rf7wj6kxeem0t3mh9yclz6j46rnen6zwz30l
static immutable NODE3Data = KeyData("node3",
    Point([218, 225, 147, 110, 171, 251, 159, 89, 188, 221, 169, 196, 170, 163, 79, 157, 45, 88, 217, 206, 222, 184, 238, 229, 38, 62, 45, 74, 186, 28, 243, 61]),
    Scalar([19, 34, 116, 81, 73, 134, 255, 118, 5, 93, 182, 15, 92, 106, 229, 22, 144, 172, 196, 111, 11, 226, 96, 190, 48, 207, 14, 79, 198, 249, 63, 11]));

/// NODE4: node41xrdwryuhc2tw2j97wqe3ahh37qnjya59n5etz88n9fvwyyt9jyvrvmr7sj6
static immutable NODE4Data = KeyData("node4",
    Point([218, 225, 147, 151, 194, 150, 229, 72, 190, 112, 51, 30, 222, 241, 240, 39, 34, 118, 133, 157, 50, 177, 28, 243, 42, 88, 226, 17, 101, 145, 24, 54]),
    Scalar([168, 154, 0, 25, 100, 201, 78, 145, 43, 136, 103, 92, 74, 231, 144, 74, 215, 226, 131, 164, 151, 41, 164, 254, 231, 212, 216, 201, 57, 72, 183, 13]));

/// NODE5: node51xrdwryayr9r3nacx26vwe6ymy2kl7zp7dc03q5h6zk65vnu6mtkkz7lupme
static immutable NODE5Data = KeyData("node5",
    Point([218, 225, 147, 164, 25, 71, 25, 247, 6, 86, 152, 236, 232, 155, 34, 173, 255, 8, 62, 110, 31, 16, 82, 250, 21, 181, 70, 79, 154, 218, 237, 97]),
    Scalar([95, 61, 156, 216, 72, 217, 131, 208, 146, 17, 251, 178, 120, 62, 198, 104, 3, 40, 210, 10, 244, 28, 62, 198, 115, 172, 247, 247, 69, 68, 249, 14]));

/// NODE6: node61xrdwry7vltf9mrzf62qgpdh282grqn9nlnvhzp0yt8y0y9zedmgh69z4je9
static immutable NODE6Data = KeyData("node6",
    Point([218, 225, 147, 204, 250, 210, 93, 140, 73, 210, 128, 128, 182, 234, 58, 144, 48, 76, 179, 252, 217, 113, 5, 228, 89, 200, 242, 20, 89, 110, 209, 125]),
    Scalar([153, 5, 199, 249, 62, 121, 232, 14, 54, 80, 152, 14, 196, 96, 3, 104, 145, 249, 124, 15, 228, 151, 47, 94, 243, 163, 246, 116, 178, 187, 146, 15]));

/// NODE7: node71xrdwryl0ajdd86c45w4zrjf8spmrt7u4l7s5jy64ac3dc78x2ucd7lcuaz7
static immutable NODE7Data = KeyData("node7",
    Point([218, 225, 147, 239, 236, 154, 211, 235, 21, 163, 170, 33, 201, 39, 128, 118, 53, 251, 149, 255, 161, 73, 19, 85, 238, 34, 220, 120, 230, 87, 48, 223]),
    Scalar([179, 140, 94, 203, 162, 206, 19, 164, 103, 79, 120, 70, 54, 75, 95, 43, 254, 78, 142, 180, 48, 94, 207, 53, 145, 159, 181, 214, 137, 231, 240, 11]));

"""

by_index_start = """package KeyData wellKnownKeyDataByIndex (size_t index) @safe pure nothrow @nogc
{
    switch (index)
    {
"""

end_data = """\t];

    if (auto hrp = point in WKHRPs)
        return *hrp;
    else
        return null;
}
"""

if __name__ == '__main__':
    infile_keys = open('./WellKnownKeys.data', 'r')
    infile_data_templ = open('./WellKnownKeyData.org', 'r')
    infile_key_templ = open('./WellKnownKeys.org', 'r')
    outfile_keys = open('../source/agora/utils/WellKnownKeys.d', 'w+')
    outfile_data = open('../source/agora/utils/WellKnownHRPs.d', 'w+')
    address_data = open('./AddressString.data', 'r')

    # copy WellKnownKeys template file
    for line in infile_key_templ:
        outfile_keys.write(line)

    # copy WellknowKeysData template file
    for line in infile_data_templ:
        outfile_data.write(line)

    # read address into dict
    addr_dict = dict()
    for line in address_data:
        if line.startswith('//'):
            continue
        keyval = line.split(':')
        addr_dict[keyval[0]] = keyval[1]

    count = 0;
    find_count = 0
    found_a = False
    found_aaa = False;
    for line in infile_keys:
        count += 1

        if line.startswith('/// A: GDA22T4I2OTZTFQBUY36GXJOPREZ5HZFG2RII5ERMUNXZ2NFSZDADLGE'):
            found_a = True
        if found_a == False:
            continue

        find_str = 'static immutable '

        if line.startswith(find_str) :
            pos = line.find(' = ')
            if pos == 0 :
                assert(0)

            # Data name like, A, B, C ...
            key_name_str = line[len(find_str) : pos]
            find_count += 1

            # find Point
            pos = line.find('Point([')
            middle_str = '), \"';
            pos2 = line.find(middle_str)
            if pos == 0:
                assert(0)
            point_str = line[pos : pos2]

            # find HRP
            secret_find = '), SecretKey('
            secret_pos = line.find(secret_find)
            if secret_pos == 0:
                assert(0)
            hrp_str = line[pos2 + len(middle_str) - 1 : secret_pos]

            # shorten HRP
            # gd_str = "\"gd";
            # gd_pos = hrp_str.find(gd_str)
            # assert(gd_pos == 0)
            # hrp_str = "\"" + hrp_str[len(gd_str) : len(hrp_str)]

            # find address
            # only_hrp = hrp_str.replace("\"", "");

            # write folling hrp & point
            # write_str += '\n\t'
            # write_str += hrp_str + ',\n\t'
            # write_str += point_str
            # write_str += '),\n\t'
            if hrp_str == '"gdaaa"':
                found_aaa = True

            if found_aaa == False:
                outfile_data.write("        ");
                outfile_data.write(point_str + ") : \n");
                outfile_data.write("            " + hrp_str + ",\n");

            # find Scalar
            last_str = '])));'
            pos_last = line.find(last_str);
            if pos_last == 0:
                assert(0)
            scalar_str = line[secret_pos + len(secret_find) : pos_last + 1]
            # write_str += scalar_str + '));'
            # write_str += "\n"

            new_line = find_str + key_name_str + ' = ' + 'KeyPair(PublicKey(' + point_str  + ')), SecretKey(' + scalar_str + ')));\n'
            outfile_keys.write(new_line)

        else:
            name_end = line.find(': ')
            name = line[4 : name_end]
            gd_name = 'gd' + name.lower()
            addr = addr_dict[gd_name]
            new_line = '/// ' + name + '("gd' + name.lower() + '"): ' + addr
            # write_str += new_line
            outfile_keys.write(new_line)

    outfile_data.write(end_data)



