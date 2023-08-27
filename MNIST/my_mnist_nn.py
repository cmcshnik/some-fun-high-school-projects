import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
import torch
import torchvision



def return_data():
    train_loader = torch.utils.data.DataLoader(
        torchvision.datasets.MNIST('/files/', train=True, download=True, transform=torchvision.transforms.Compose([
            torchvision.transforms.ToTensor(),
            torchvision.transforms.Normalize((0.1307,), (0.3081,))])
                                   ), batch_size=batch_size_train, shuffle=True)

    test_loader = torch.utils.data.DataLoader(torchvision.datasets.MNIST('/files/', train=False, download=True,
     transform=torchvision.transforms.Compose([
         torchvision.transforms.ToTensor(),
         torchvision.transforms.Normalize(
             (0.1307,), (0.3081,))
     ])), batch_size=batch_size_test, shuffle=True)

    return train_loader, test_loader


class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.conv1 = nn.Conv2d(1, 10, kernel_size=5)
        self.conv2 = nn.Conv2d(10, 20, kernel_size=5)
        self.conv2_drop = nn.Dropout2d()
        self.fc1 = nn.Linear(320, 50)
        self.fc2 = nn.Linear(50, 10)

    def forward(self, x):
        x = F.relu(F.max_pool2d(self.conv1(x), 2))
        x = F.relu(F.max_pool2d(self.conv2_drop(self.conv2(x)), 2))
        x = x.view(-1, 320)
        x = F.relu(self.fc1(x))
        x = F.dropout(x, training=self.training)
        x = self.fc2(x)
        return F.log_softmax(x)

def train(model, opt, data):
    model.train()
    for batch_idx, (data, target) in enumerate(data):
        opt.zero_grad()
        output = model(data)
        loss = F.cross_entropy(output, target)
        loss.backward()
        opt.step()
        print('loss: ', loss.tolist())

def save_model(model, model_path, opt, opt_path):
    torch.save(model.state_dict(), model_path)
    torch.save(opt.state_dict(), opt_path)

def test(model, test_data):
    model.eval()
    correct = 0
    with torch.no_grad():
        for data, target in test_data:
            output = model(data)
            pred = output.data.max(1, keepdim=True)[1]
            correct += pred.eq(target.data.view_as(pred)).sum()
    print('Accuracy:', correct / len(test_data.dataset))

epochs = 10
batch_size_train = 64
batch_size_test = 1000
learning_rate = 0.01

def main():
    network = Net()
    optimizer = optim.Adam(network.parameters(), lr=learning_rate)
    train_data, test_data = return_data()


    for epoch in range(1, epochs + 1):
        train(network, optimizer, train_data)

    test(network, test_data)

    ans = input('Do you want to save? y/n')
    if ans == 'y':
        save_model(network, 'results/model.pth', optimizer, './results/optimizer.pth')


if __name__ == "__main__":
    main()
