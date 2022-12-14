
### Get this product for $5

<i>Packt is having its biggest sale of the year. Get this eBook or any other book, video, or course that you like just for $5 each</i>


<b><p align='center'>[Buy now](https://packt.link/9781787122147)</p></b>


<b><p align='center'>[Buy similar titles for just $5](https://subscription.packtpub.com/search)</p></b>


# Building Blockchain Projects
This is the code repository for [Building Blockchain Projects](https://www.packtpub.com/big-data-and-business-intelligence/building-blockchain-projects?utm_source=github&utm_medium=repository&utm_campaign=9781787122147), published by [Packt](https://www.packtpub.com/?utm_source=github). It contains all the supporting project files necessary to work through the book from start to finish.
## About the Book
This book will teach you what Blockchain is, how it maintains data integrity, and how to create real-world Blockchain projects using Ethereum. With interesting real-world projects, you will know learn how to write smart contracts which run exactly as programmed without any chance of fraud, censorship or third-party interference, and build end-to-end applications for Blockchain. You will learn concepts such as cryptography in cryptocurrencies, ether security, mining, smart contracts, and solidity.
##Instructions and Navigation
All of the code is organized into folders. Each folder starts with a number followed by the application name. For example, Chapter02.

chapters 1, 2, 3 do not have any code files.
chapter 1 is introduction, chapter 2 is setup and chapter 3 have minimal one class codes.

The code will look like the following:
```
var solc = require("solc"); 
var input = "contract x { function g() {} }"; 
var output = solc.compile(input, 1); // 1 activates the optimizer  
for (var contractName in output.contracts) { 
    // logging code and ABI  
    console.log(contractName + ": " + output.contracts[contractName].bytecode); 
    console.log(contractName + "; " + JSON.parse(output.contracts[contractName].interface)); 
}
```

You require Windows 7 SP1+, 8, 10 or Mac OS X 10.8+.

## Related Products
* [Learn Nodejs by building 12 projects [Video]](https://www.packtpub.com/web-development/learn-nodejs-building-12-projects-video?utm_source=github&utm_medium=repository&utm_campaign=9781787122215)

* [Building Machine Learning Projects with TensorFlow](https://www.packtpub.com/big-data-and-business-intelligence/building-machine-learning-projects-tensorflow?utm_source=github&utm_medium=repository&utm_campaign=9781786466587)

* [Learn MeteorJS By Building 10 Real World Projects [Video]](https://www.packtpub.com/application-development/learn-meteorjs-building-10-real-world-projects-video?utm_source=github&utm_medium=repository&utm_campaign=9781787129726)

### Suggestions and Feedback
[Click here](https://docs.google.com/forms/d/e/1FAIpQLSe5qwunkGf6PUvzPirPDtuy1Du5Rlzew23UBp2S-P3wB-GcwQ/viewform) if you have any feedback or suggestions.
### Download a free PDF

 <i>If you have already purchased a print or Kindle version of this book, you can get a DRM-free PDF version at no cost.<br>Simply click on the link to claim your free PDF.</i>
<p align="center"> <a href="https://packt.link/free-ebook/9781787122147">https://packt.link/free-ebook/9781787122147 </a> </p>