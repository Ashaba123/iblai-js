import{R as o}from"./index-DhY--VwN.js";const j=({variant:A="primary",onClick:T,children:_,disabled:s=!1})=>{const i={button:{padding:"12px 24px",border:"none",borderRadius:"8px",fontSize:"16px",fontWeight:600,cursor:s?"not-allowed":"pointer",opacity:s?.6:1,transition:"all 0.2s"},primary:{backgroundColor:"#007AFF",color:"#FFFFFF"},secondary:{backgroundColor:"#5856D6",color:"#FFFFFF"},danger:{backgroundColor:"#FF3B30",color:"#FFFFFF"}};return o.createElement("button",{style:{...i.button,...i[A]},onClick:T,disabled:s},_)},M={title:"Example/Button",component:j,tags:["autodocs"],parameters:{docs:{description:{component:`
Example button component showing documentation standards.

## Usage

\`\`\`tsx
import { ExampleButton } from '@iblai/iblai-js';

<ExampleButton variant="primary" onClick={() => alert('clicked')}>
  Click me
</ExampleButton>
\`\`\`

## Features

- Multiple variants (primary, secondary, danger)
- Disabled state
- Accessible
- Fully typed with TypeScript
        `}}},argTypes:{variant:{control:"select",options:["primary","secondary","danger"],description:"Button style variant"},disabled:{control:"boolean",description:"Disable the button"},onClick:{action:"clicked",description:"Click handler function"}}},r={args:{variant:"primary",children:"Primary Button"}},e={args:{variant:"secondary",children:"Secondary Button"}},a={args:{variant:"danger",children:"Delete"}},t={args:{variant:"primary",children:"Disabled Button",disabled:!0}},n={args:{variant:"primary",children:o.createElement("span",{style:{display:"flex",alignItems:"center",gap:"8px"}},o.createElement("span",null,"⭐"),o.createElement("span",null,"Star"))}};var c,p,d,l,m;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Primary Button'
  }
}`,...(d=(p=r.parameters)==null?void 0:p.docs)==null?void 0:d.source},description:{story:"Primary button for main actions",...(m=(l=r.parameters)==null?void 0:l.docs)==null?void 0:m.description}}};var u,y,g,b,F;e.parameters={...e.parameters,docs:{...(u=e.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'Secondary Button'
  }
}`,...(g=(y=e.parameters)==null?void 0:y.docs)==null?void 0:g.source},description:{story:"Secondary button for less prominent actions",...(F=(b=e.parameters)==null?void 0:b.docs)==null?void 0:F.description}}};var h,x,v,S,B;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    children: 'Delete'
  }
}`,...(v=(x=a.parameters)==null?void 0:x.docs)==null?void 0:v.source},description:{story:"Danger button for destructive actions",...(B=(S=a.parameters)==null?void 0:S.docs)==null?void 0:B.description}}};var D,f,E,k,C;t.parameters={...t.parameters,docs:{...(D=t.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Disabled Button',
    disabled: true
  }
}`,...(E=(f=t.parameters)==null?void 0:f.docs)==null?void 0:E.source},description:{story:"Disabled state prevents interaction",...(C=(k=t.parameters)==null?void 0:k.docs)==null?void 0:C.description}}};var P,w,I,R,W;n.parameters={...n.parameters,docs:{...(P=n.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: <span style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
        <span>⭐</span>
        <span>Star</span>
      </span>
  }
}`,...(I=(w=n.parameters)==null?void 0:w.docs)==null?void 0:I.source},description:{story:"Example with custom content",...(W=(R=n.parameters)==null?void 0:R.docs)==null?void 0:W.description}}};const O=["Primary","Secondary","Danger","Disabled","WithIcon"];export{a as Danger,t as Disabled,r as Primary,e as Secondary,n as WithIcon,O as __namedExportsOrder,M as default};
