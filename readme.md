# Geralds Contracting
---

This application is build for calculating the studs, posts, and plates needed for a single wall based on Geralds requirements which you can read [here](https://github.com/Focus-College/developing-software-intro-assignment-3/blob/master/assignment/user-stories.md#geralds-contracting-application-assignment-3).

## How to use this application
---
 First you need to run the following to build the application:

 ```
 tsc
 ```

 Second put your numbers in the following order:

 ```
npm start -- calc-wood-needed -n 'customer name' -w (widthinfeet) -i (extra inches for the width) 
```
### Example
```
npm start -- calc-wood-needed -n 'Jacklyn' -w 8 -i 5
```
this will give us a results of:
```
  _width: 8,
  _length: 0,
  name: 'Jacklyn',
  widthMaterials: { name: 'Jacklyn', posts: 0, studs: 14, plates: 8 },
  lengthMaterials: { name: 'Jacklyn', posts: 0, studs: 14, plates: 8 }
  ```
 
If you want to search an existing customer house using the customer name run the following command:

```
npm start -- customer-house -n 'customer name'
```

### Example 

```
npm start -- customer-house -n 'Jacklyn'
```

this will give us the following:
```
_width: 8,
  _length: 0,
  name: 'Jacklyn',
  widthMaterials: { studs: 14, posts: 0, plates: 8 },
  lengthMaterials: { studs: 18, posts: 0, plates: 0 }
  ```

# last edit by: Angham Alshahud.
