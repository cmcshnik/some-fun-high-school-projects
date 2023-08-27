class Dict:
    def __init__(self, len=2):
        self.table = []
        self.length = 0
        for i in range(len):
            self.table.append([[], [], False])

    def resize_table(self):
        tmp_arr = Dict(len(self.table) * 2)

        for k, v, d in self.table:
            if k != []:
                tmp_arr[k] = v

        self.table = tmp_arr.table

    def __len__(self):
        return self.length

    def __getitem__(self, key):
        index = Dict.linear_search(self, key)

        if (self.table[index][0] != []) and (self.table[index][0] == key): return self.table[index][1]
        else: raise KeyError(key)

    def __contains__(self, key):
        index = Dict.linear_search(self, key)

        if self.table[index][0] == key: answer = True
        else: answer = False

        return answer

    def linear_search(self, key):
        index = hash(key) % len(self.table)
        first_dirty_index = None

        while not( self.table[index][0] == [] and self.table[index][2] is False ):

            if self.table[index][0] == key:
                break

            if self.table[index][2]:
                if first_dirty_index is None:
                    first_dirty_index = index
                if first_dirty_index is not None:
                    self.table[index][2] = False

            if index == len(self.table) - 1:
                index = -1
            index += 1

        if first_dirty_index is not None:
            key = self.table[index][0]
            value = self.table[index][1]

            self.table[index][0] = []
            self.table[index][1] = []

            self.table[first_dirty_index][0] = key
            self.table[first_dirty_index][1] = value
            return first_dirty_index
        else: return index


    def __setitem__(self, key, value):
        index = Dict.linear_search(self, key)

        if self.table[index][0] == []: self.length += 1
        else: self.length += 0

        self.table[index][0] = key
        self.table[index][1] = value
        self.table[index][2] = False

        if self.length >= (len(self.table) // 100): Dict.resize_table(self)


    def __delitem__(self, key):
        index = Dict.linear_search(self, key)

        if (self.table[index][0] != key): raise KeyError(key)
        else:
            self.length -= 1
            self.table[index][0] = []
            self.table[index][1] = []
            self.table[index][2] = True


