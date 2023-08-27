from my_mnist_nn import *
import matplotlib.pyplot as plt
import random as r

n_epochs = 3
batch_size_train = 64
batch_size_test = 1000
learning_rate = 0.01
momentum = 0.5
log_interval = 10
random_seed = 1
torch.manual_seed(random_seed)

_, test_data = return_data()
arr = []
for _, (example_data, _) in enumerate(test_data):
    arr.append(example_data)
ind = r.randint(0, len(arr))
example_data = arr[ind]


network = Net()
optimizer = optim.SGD(network.parameters(), lr=learning_rate)
network_state_dict = torch.load('results/model.pth')
network.load_state_dict(network_state_dict)
optimizer_state_dict = torch.load('./results/optimizer.pth')
optimizer.load_state_dict(optimizer_state_dict)



with torch.no_grad():
  output = network(example_data)

fig = plt.figure()
for i in range(6):
  plt.subplot(2,3,i+1)
  plt.tight_layout()
  plt.imshow(example_data[i][0], cmap='gray', interpolation='none')
  plt.title("Prediction: {}".format(
    output.data.max(1, keepdim=True)[1][i].item()))
  plt.xticks([])
  plt.yticks([])
plt.show()