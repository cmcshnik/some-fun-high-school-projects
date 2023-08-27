import torch
import random


class DenseLayer:
    def __init__(self, activation, input_size, output_size):
        self.weights = torch.normal(mean=0.0, std=2.0 / (input_size + output_size) ** 0.5,
                                    size=(input_size, output_size))
        self.weights.requires_grad_()

        self.bias = torch.zeros(output_size)
        self.bias.requires_grad_()

        self.activation = activation

    def __call__(self, inputs):
        return self.activation(
            torch.tensordot(inputs, self.weights, dims=1) + self.bias
        )

    def update_weights(self, learning_rate):
        with torch.no_grad():  ## отключает построение графа вычислений
            self.weights -= self.weights.grad * learning_rate
            self.weights.grad = None

            self.bias -= self.bias.grad * learning_rate
            self.bias.grad = None


class Network:
    def __init__(self, input_size, layer_sizes, output_size):
        self.layers = []

        prev_size = input_size
        for size in layer_sizes:
            self.layers.append(
                DenseLayer(relu, prev_size, size)
            )
            prev_size = size

        self.layers.append(
            DenseLayer(softmax, prev_size, output_size)
        )

    def __call__(self, inputs):
        for layer in self.layers:
            inputs = layer(inputs)
        return inputs

    def train(self, words, targets, learning_rate):
        targets = torch.tensor(targets)
        calc = self(words[0]).clone()
        calc = torch.reshape(calc, (1, 3,))
        for i in range(1, len(words)):
            tmp = self(words[i])
            tmp = torch.reshape(tmp, (1, 3,))
            calc = torch.cat((calc, tmp))

        loss = cross_entropy(calc, targets)
        loss.backward()

        for layer in self.layers:
            layer.update_weights(learning_rate)

        return loss.item()


alph = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
char_table = {alph[i]: i for i in range(len(alph))}
MAX_WORD_LENGTH = 20
BATCH_SIZE = 50


def WordToOneHot(word):
    onehot = [0] * BATCH_SIZE * MAX_WORD_LENGTH

    for i in range(MAX_WORD_LENGTH):
        letterInd = len(word) - 1 - i

        if letterInd < 0: break

        offset = char_table[word[letterInd]]
        onehot[BATCH_SIZE * i + offset] = 1
    ans = torch.tensor(onehot)
    ans = ans.float()
    return ans


def ClassToOneHot(cl):
    if cl == 0: return [1., 0., 0.]
    if cl == 1: return [0., 1., 0.]
    if cl == 2: return [0., 0., 1.]


def LoadDictionary(filename):
    f = open(filename, encoding='utf-8')
    result = []

    for line in f.readlines():
        word, cl = line.split()
        result.append((WordToOneHot(word), ClassToOneHot(int(cl))))
    return result


def GenBatch(x):
    a = random.randint(0, len(x) - BATCH_SIZE - 1)
    tmp = x[a:a + BATCH_SIZE]
    words, targets = [], []
    for el in tmp:
        words.append(el[0])
        targets.append(el[1])
    return words, targets


def GetTestingData(filename):
    f = open(filename, encoding='utf-8')
    result = []

    for line in f.readlines():
        line = line.split()
        result.append((WordToOneHot(line[0]), int(line[1])))
    return result


def relu(x):
    return (x > 0) * x


def softmax(x):
    return x.exp() / x.exp().sum(-1)


def cross_entropy(x, y):
    N = BATCH_SIZE
    loss = -1 * (1 / N) * (torch.tensordot(y, x.log()))
    return loss


def retrain(model, epochs, speed, data):
    for epoch in range(epochs + 1):
        words, targets = GenBatch(data)
        loss = model.train(words, targets, speed)
        if epoch % (epochs // 10) == 0:
            print(f'completed {epoch // (epochs // 100)}%', 'loss = ', loss)

    torch.save(model, 'saved_model.txt')
    print('== Training copleted ==')
    return model


def main():
    data = LoadDictionary('russian_nouns.txt')

    nn = Network(BATCH_SIZE * MAX_WORD_LENGTH, [20, 16, 10, 16, 20], 3)
    epochs = 2000

    for epoch in range(epochs + 1):
        words, targets = GenBatch(data)
        loss = nn.train(words, targets, 0.01)
        if epoch % (epochs // 10) == 0:
            print(f'completed {epoch // (epochs // 100)}%', 'loss = ', loss)
    print('== Training copleted ==')

    test_data = GetTestingData('for_test.txt')
    score = 0
    for test_word, cl in test_data:
        tmp = nn(test_word).tolist()
        m = max(tmp)
        ind = tmp.index(m)
        if ind == cl: score += 1
    print('Accuracy on test data:', f'{score / len(test_data) * 100}%')

    torch.save(nn, 'saved_model.txt')

    while True:
        word = input()
        tmp = nn(WordToOneHot(word)).tolist()
        m = max(tmp)
        ind = tmp.index(m)
        if ind == 0: print("Мужской")
        if ind == 1: print("Женский")
        if ind == 2: print("Средний")


if __name__ == "__main__":
    main()