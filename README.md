<h1 align="center">CSS-sort</h1>

<br />

### How to use it?

<br />

<p align="center">
  <img src="https://i.ibb.co/60Sk5NY/oie-AKNRT94-Qt1bw.png" alt="this-is-img" />
</p>

<br />

<h3>From this :</h3>

```css
.component {
   white-space: pre-line;
   display: block;
   resize: none;
   font-family: monospace;
   width: 100%;
   padding: 15px;
   border: 1px solid #38444d;
   font-size: 18px;
   outline: none;
   transition: background-color 0.2s;
   box-sizing: border-box;
   background-color: #253341;
   margin-top: 17px;
   color: #f5f5f5;
}
```

<br />

<h3>To this (smaller to bigger) :</h3>

```css
.component {
   width: 100%;
   resize: none;
   padding: 15px;
   outline: none;
   display: block;
   color: #f5f5f5;
   font-size: 18px;
   margin-top: 17px;
   white-space: pre-line;
   font-family: monospace;
   box-sizing: border-box;
   border: 1px solid #38444d;
   background-color: #253341;
   transition: background-color 0.2s;
}
```

<br />

<h3>Or this (bigger to smaller) :</h3>

```css
.component {
   transition: background-color 0.2s;
   border: 1px solid #38444d;
   background-color: #253341;
   font-family: monospace;
   box-sizing: border-box;
   white-space: pre-line;
   margin-top: 17px;
   font-size: 18px;
   display: block;
   color: #f5f5f5;
   padding: 15px;
   outline: none;
   resize: none;
   width: 100%;
}
```
