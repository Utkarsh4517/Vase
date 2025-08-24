import * as React from "react"
import Svg, { Rect, Mask, Path, Defs, LinearGradient, Stop, G, Circle } from "react-native-svg"

function VaseLogo(props: any) {
  return (
    <Svg
      width={1024}
      height={1024}
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect width={1024} height={1024} rx={120} fill="#fff" />
      <Mask
        id="a"
        maskUnits="userSpaceOnUse"
        x={282}
        y={288}
        width={437}
        height={601}
        fill="#000"
      >
        <Path fill="#fff" d="M282 288H719V889H282z" />
        <Path d="M376.6 298h328l-204 560.8-204-560.8h25.6l178.4 490.4L670.2 322H376.6v-24z" />
      </Mask>
      <Path
        d="M376.6 298h328l-204 560.8-204-560.8h25.6l178.4 490.4L670.2 322H376.6v-24z"
        fill="#303030"
      />
      <Path
        d="M376.6 298v-10h-10v10h10zm328 0l9.398 3.418L718.879 288H704.6v10zm-204 560.8l-9.398 3.419 9.398 25.834 9.398-25.834-9.398-3.419zM296.6 298v-10h-14.279l4.881 13.418L296.6 298zm25.6 0l9.397-3.419-2.394-6.581H322.2v10zm178.4 490.4l-9.397 3.419 9.399 25.837 9.396-25.839-9.398-3.417zM670.2 322l9.398 3.417L684.477 312H670.2v10zm-293.6 0h-10v10h10v-10zm0-24v10h328v-20h-328v10zm328 0l-9.398-3.419-204 560.8 9.398 3.419 9.398 3.419 204-560.801L704.6 298zm-204 560.8l9.398-3.419-204-560.8L296.6 298l-9.398 3.418 204 560.801 9.398-3.419zM296.6 298v10h25.6v-20h-25.6v10zm25.6 0l-9.397 3.419 178.4 490.4 9.397-3.419 9.397-3.419-178.4-490.4L322.2 298zm178.4 490.4l9.398 3.417 169.6-466.4L670.2 322l-9.398-3.417-169.6 466.4 9.398 3.417zM670.2 322v-10H376.6v20h293.6v-10zm-293.6 0h10v-24h-20v24h10z"
        fill="#303030"
        mask="url(#a)"
      />
    </Svg>
  )
}

function VaseDarkLogo(props: any) {
  return (
    <Svg
      width={1024}
      height={1024}
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path fill="url(#paint0_linear_1_7)" d="M0 0H1024V1024H0z" />
      <Path
        d="M466.4 747c-40.4 0-69-5.6-85.8-16.8-16.8-11.6-25.2-30.4-25.2-56.4v-62.4c.4-17.2.6-33.2.6-48 0-22.8-.8-45.8-2.4-69-1.6-23.2-4.8-45.4-9.6-66.6-4.8-21.2-12-40.4-21.6-57.6-9.6-17.2-22.4-31.2-38.4-42 27.2-20.8 58.4-31.2 93.6-31.2 24.4 0 43.8 7 58.2 21 14.4 14 25.2 32.8 32.4 56.4 7.2 23.2 11.8 49 13.8 77.4 2.4 28 3.6 56.2 3.6 84.6 0 18.4-.4 36.2-1.2 53.4-.4 17.2-.6 33-.6 47.4h15.6c9.2-20 19-42.6 29.4-67.8 10.4-25.2 20.2-50.8 29.4-76.8s16.6-50.6 22.2-73.8c6-23.2 9-42.6 9-58.2 0-6.8-.6-12.8-1.8-18-1.2-5.6-2.8-10.4-4.8-14.4 15.2-10.4 29.4-18.2 42.6-23.4 13.6-5.2 27.4-7.8 41.4-7.8 22 0 37.4 6.4 46.2 19.2 9.2 12.4 13.8 28.6 13.8 48.6 0 14.8-2.8 32.2-8.4 52.2-5.6 20-13 41.2-22.2 63.6-8.8 22.4-18.2 44.8-28.2 67.2-10 22-19.8 42.8-29.4 62.4-9.2 19.6-16.8 36.6-22.8 51l8.4 33c-11.2 9.2-25.4 17.8-42.6 25.8-16.8 8-35.2 14.4-55.2 19.2-19.6 5.2-39.6 7.8-60 7.8z"
        fill="url(#paint1_linear_1_7)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1_7"
          x1={175.514}
          y1={-58.6187}
          x2={645.155}
          y2={1123.66}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset={0.0865357} stopColor="#7E7E7E" />
          <Stop offset={0.306909} stopColor="#3F3F3F" />
          <Stop offset={0.48531} stopColor="#232323" />
          <Stop offset={0.920037} stopColor="#161616" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_1_7"
          x1={502.5}
          y1={120}
          x2={502.5}
          y2={904}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset={0.08} stopColor="#fff" stopOpacity={0.9} />
          <Stop offset={1} stopColor="#999" stopOpacity={0.2} />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}

function VaseBlueLogo(props: any) {
  return (
    <Svg
      width={582}
      height={582}
      viewBox="0 0 582 582"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G filter="url(#filter0_di_3_6)">
        <Rect
          x={21}
          y={17}
          width={500}
          height={500}
          rx={100}
          ry={100}
          fill="url(#paint0_linear_3_6)"
        />
        <Path
          d="M253.2 384.5c-20.2 0-34.5-2.8-42.9-8.4-8.4-5.8-12.6-15.2-12.6-28.2v-31.2c.2-8.6.3-16.6.3-24 0-11.4-.4-22.9-1.2-34.5-.8-11.6-2.4-22.7-4.8-33.3-2.4-10.6-6-20.2-10.8-28.8-4.8-8.6-11.2-15.6-19.2-21 13.6-10.4 29.2-15.6 46.8-15.6 12.2 0 21.9 3.5 29.1 10.5 7.2 7 12.6 16.4 16.2 28.2 3.6 11.6 5.9 24.5 6.9 38.7 1.2 14 1.8 28.1 1.8 42.3 0 9.2-.2 18.1-.6 26.7-.2 8.6-.3 16.5-.3 23.7h7.8c4.6-10 9.5-21.3 14.7-33.9 5.2-12.6 10.1-25.4 14.7-38.4s8.3-25.3 11.1-36.9c3-11.6 4.5-21.3 4.5-29.1 0-3.4-.3-6.4-.9-9-.6-2.8-1.4-5.2-2.4-7.2 7.6-5.2 14.7-9.1 21.3-11.7 6.8-2.6 13.7-3.9 20.7-3.9 11 0 18.7 3.2 23.1 9.6 4.6 6.2 6.9 14.3 6.9 24.3 0 7.4-1.4 16.1-4.2 26.1-2.8 10-6.5 20.6-11.1 31.8-4.4 11.2-9.1 22.4-14.1 33.6-5 11-9.9 21.4-14.7 31.2-4.6 9.8-8.4 18.3-11.4 25.5l4.2 16.5c-5.6 4.6-12.7 8.9-21.3 12.9-8.4 4-17.6 7.2-27.6 9.6-9.8 2.6-19.8 3.9-30 3.9z"
          fill="url(#paint1_linear_3_6)"
        />
      </G>
      <Defs>
        <LinearGradient
          id="paint0_linear_3_6"
          x1={85.7002}
          y1={-28.6224}
          x2={315.017}
          y2={548.663}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset={0.0865357} stopColor="#5D8AFB" />
          <Stop offset={0.306909} stopColor="#224AE4" />
          <Stop offset={0.48531} stopColor="#2126CC" />
          <Stop offset={0.920037} stopColor="#111339" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_3_6"
          x1={271.5}
          y1={71}
          x2={271.5}
          y2={463}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset={0.08} stopColor="#fff" stopOpacity={0.9} />
          <Stop offset={1} stopColor="#999" stopOpacity={0.2} />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}

function VaseWhiteLogo(props: any) {
  const borderRadius = 100;
  return (
    <Svg
      width={582}
      height={582}
      viewBox="0 0 582 582"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G filter="url(#filter0_di_11_22)">
        <Rect
          x={21}
          y={17}
          width={500}
          height={500}
          rx={borderRadius}
          ry={borderRadius}
          fill="#fff"
        />
        <Path
          d="M253.2 384.5c-20.2 0-34.5-2.8-42.9-8.4-8.4-5.8-12.6-15.2-12.6-28.2v-31.2c.2-8.6.3-16.6.3-24 0-11.4-.4-22.9-1.2-34.5-.8-11.6-2.4-22.7-4.8-33.3-2.4-10.6-6-20.2-10.8-28.8-4.8-8.6-11.2-15.6-19.2-21 13.6-10.4 29.2-15.6 46.8-15.6 12.2 0 21.9 3.5 29.1 10.5 7.2 7 12.6 16.4 16.2 28.2 3.6 11.6 5.9 24.5 6.9 38.7 1.2 14 1.8 28.1 1.8 42.3 0 9.2-.2 18.1-.6 26.7-.2 8.6-.3 16.5-.3 23.7h7.8c4.6-10 9.5-21.3 14.7-33.9 5.2-12.6 10.1-25.4 14.7-38.4s8.3-25.3 11.1-36.9c3-11.6 4.5-21.3 4.5-29.1 0-3.4-.3-6.4-.9-9-.6-2.8-1.4-5.2-2.4-7.2 7.6-5.2 14.7-9.1 21.3-11.7 6.8-2.6 13.7-3.9 20.7-3.9 11 0 18.7 3.2 23.1 9.6 4.6 6.2 6.9 14.3 6.9 24.3 0 7.4-1.4 16.1-4.2 26.1-2.8 10-6.5 20.6-11.1 31.8-4.4 11.2-9.1 22.4-14.1 33.6-5 11-9.9 21.4-14.7 31.2-4.6 9.8-8.4 18.3-11.4 25.5l4.2 16.5c-5.6 4.6-12.7 8.9-21.3 12.9-8.4 4-17.6 7.2-27.6 9.6-9.8 2.6-19.8 3.9-30 3.9z"
          fill="url(#paint0_linear_11_22)"
        />
      </G>
      <Defs>
        <LinearGradient
          id="paint0_linear_11_22"
          x1={464.5}
          y1={-96.5}
          x2={162}
          y2={256}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset={0.08} stopOpacity={0.9} />
          <Stop offset={1} stopColor="#171717" stopOpacity={0.9} />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}

function EyeIcon ({ size = 20, color = "#AEAEAE" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
    </Svg>
  )
}

function PlusIcon ({ size = 20, color = "white" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5V19M5 12H19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

function DownArrowIcon ({ size = 20, color = "white" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5V19M19 12L12 19L5 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
function CardIcon ({ size = 20, color = "white" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect 
        x="2" 
        y="6" 
        width="20" 
        height="12" 
        rx="2" 
        stroke={color} 
        strokeWidth="2"
        fill="none"
      />
      <Path
        d="M2 10H22"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  )
}

function LockIcon ({ size = 64, color = "#AEAEAE" }: any){
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Rect
        x="15"
        y="40"
        width="70"
        height="50"
        rx="12"
        ry="12"
        fill={color}
        stroke={color}
        strokeWidth="3"
      />
      
      <Path
        d="M25 40 V22 C25 12.1 32.1 5 42 5 L58 5 C67.9 5 75 12.1 75 22 V40"
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
      />
      <Circle
        cx="50"
        cy="60"
        r="6"
        fill="white"
      />
      <Rect
        x="47"
        y="63"
        width="6"
        height="12"
        fill="white"
      />
    </Svg>
  )
}


function UnlockedLockIcon ({ size = 64, color = "#AEAEAE" }: any){
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Rect
        x="15"
        y="40"
        width="70"
        height="50"
        rx="12"
        ry="12"
        fill={color}
        stroke={color}
        strokeWidth="3"
      />
      
      <Path
        d="M25 40 V22 C25 12.1 32.1 5 42 5 L58 5 C67.9 5 75 12.1 75 22 V25"
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
      />
      <Circle
        cx="50"
        cy="60"
        r="6"
        fill="white"
      />
      <Rect
        x="47"
        y="63"
        width="6"
        height="12"
        fill="white"
      />
    </Svg>
  )
}


export  {VaseLogo, VaseDarkLogo, VaseBlueLogo, VaseWhiteLogo, EyeIcon, LockIcon, CardIcon,DownArrowIcon,PlusIcon , UnlockedLockIcon}
