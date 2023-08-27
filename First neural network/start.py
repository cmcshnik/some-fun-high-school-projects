from nn import *

def main():
    filename = input('Enter the name of the file with the model: ')
    nn = torch.load(filename)
    data = LoadDictionary('russian_nouns.txt')
    decision = input("Do you want to train her more? y/n ")
    if decision == 'y':
        epochs = int(input('Number of epochs: '))
        speed = float(input('Speed: '))

        print('== Training started ==')
        nn = retrain(nn, epochs, speed, data)

    while True:
        word = input("Enter the word or 'rt' for further training: ")
        if word == 'rt':
            epochs = int(input('Number of epochs: '))
            speed = float(input('Speed: '))

            print('== Training started ==')
            nn = retrain(nn, epochs, speed, data)
        else:
            tmp = nn(WordToOneHot(word)).tolist()
            m = max(tmp)
            ind = tmp.index(m)
            if ind == 0: print("Gender: Male\n")
            if ind == 1: print("Gender: Female\n")
            if ind == 2: print("Gender: Medium\n")

main()