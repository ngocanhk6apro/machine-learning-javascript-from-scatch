# machine-learning-javascript-from-scatch

### 1.First step:
Create app to draw shape follow the category then save as json file with structure:

```json
{
  "name": "string",
  "session": "number",
  "paths": [
    {
      "category_name": [
        ["x_coordinate", "y_coordinate"]
      ]
    }
  ]
}
```
With filename is session_id.json ex: 1692504187543.json
After collecting a bunch of these json file we jump to processing data step.

### 2. Process data (data-generator.js)
When we have all raw data (*.json) file now we will process them.\
 #### 2.1 Generate sample.json file which contains flat version of all object follow by user sequentially
 ```javascript
generateSampleFile();
```

#### 2.2 Generate json file for each object of each user
```javascript
generateJsonDataSet();
```

### 2.3 Generate image file for each object of each user
```javascript
generateImageFiles();
```

### 2.4 Create viewer page to show overview about the sample.js file
```shell
cd web-app
yarn start
```
Then navigate to link `http://localhost:2024/viewer`