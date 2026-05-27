
import { useState, useEffect } from 'react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  FaCheckCircle,
  FaClipboardList,
  FaClock,
  FaMedal,
  FaTimesCircle,
  FaUserCircle,
  FaUsers,
} from 'react-icons/fa'
import SLLSidebar from '../../components/SLLSidebar'
import SLLTopbar from '../../components/SLLTopbar'
import './SLL-dashboard.css'

import { getDashboardSLL } from '../../../controllers/dashboard.controller'


function IconTeamConsultores({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 56 56"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g clipPath="url(#sll-team-consultores-clip)">
        <path opacity="0.1" d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z" fill="#39639C" />
        <path d="M28.4076 31.3856C24.1829 31.3856 20.6183 32.1016 20.6183 34.8648C20.6183 37.6292 24.206 38.3199 28.4076 38.3199C32.6323 38.3199 36.1969 37.604 36.1969 34.8408C36.1969 32.0765 32.6092 31.3856 28.4076 31.3856Z" fill="#39639C" />
        <path opacity="0.4" d="M28.4074 28.7531C31.2681 28.7531 33.5619 26.3605 33.5619 23.3766C33.5619 20.3915 31.2681 18 28.4074 18C25.5468 18 23.253 20.3915 23.253 23.3766C23.253 26.3605 25.5468 28.7531 28.4074 28.7531Z" fill="#39639C" />
        <path opacity="0.4" d="M39.5986 24.6284C40.3387 21.6091 38.1688 18.8973 35.4056 18.8973C35.1053 18.8973 34.818 18.9317 34.5373 18.99C34.5 18.9991 34.4583 19.0186 34.4364 19.0529C34.4112 19.0963 34.4298 19.1547 34.4572 19.1924C35.2872 20.407 35.7642 21.8858 35.7642 23.4733C35.7642 24.9944 35.3268 26.4126 34.5592 27.5895C34.4802 27.7107 34.5504 27.8743 34.6896 27.8994C34.8826 27.9349 35.08 27.9532 35.2818 27.9589C37.2938 28.0138 39.0996 26.6631 39.5986 24.6284Z" fill="#39639C" />
        <path d="M41.7064 31.7375C41.3379 30.9186 40.4488 30.3571 39.0967 30.0815C38.4586 29.9191 36.7317 29.6903 35.1254 29.7212C35.1013 29.7246 35.0881 29.7418 35.0859 29.7532C35.0827 29.7692 35.0892 29.7967 35.121 29.8138C35.8633 30.197 38.7327 31.8634 38.3721 35.378C38.3566 35.5301 38.4739 35.6616 38.6198 35.6387C39.326 35.5335 41.1427 35.1264 41.7064 33.858C42.0178 33.1877 42.0178 32.409 41.7064 31.7375Z" fill="#39639C" />
        <path opacity="0.4" d="M22.4018 18.9903C22.1222 18.9309 21.8338 18.8977 21.5334 18.8977C18.7703 18.8977 16.6004 21.6094 17.3416 24.6288C17.8394 26.6635 19.6453 28.0142 21.6573 27.9593C21.859 27.9536 22.0575 27.9341 22.2494 27.8998C22.3886 27.8747 22.4588 27.7111 22.3799 27.5899C21.6123 26.4119 21.1748 24.9948 21.1748 23.4737C21.1748 21.8851 21.6529 20.4063 22.4829 19.1928C22.5092 19.155 22.529 19.0967 22.5027 19.0532C22.4807 19.0178 22.4402 18.9995 22.4018 18.9903Z" fill="#39639C" />
        <path d="M17.8428 30.0811C16.4908 30.3567 15.6027 30.9183 15.2343 31.7372C14.9218 32.4085 14.9218 33.1874 15.2343 33.8587C15.7979 35.126 17.6147 35.5343 18.3208 35.6384C18.4667 35.6613 18.5829 35.5308 18.5676 35.3775C18.2068 31.8641 21.0763 30.1977 21.8197 29.8146C21.8504 29.7963 21.8569 29.77 21.8536 29.7528C21.8515 29.7414 21.8394 29.7243 21.8153 29.722C20.2079 29.6899 18.482 29.9187 17.8428 30.0811Z" fill="#39639C" />
      </g>
      <defs>
        <clipPath id="sll-team-consultores-clip"><rect width="56" height="56" fill="white" /></clipPath>
      </defs>
    </svg>
  )
}

function IconTeamBadges({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 56 56"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g clipPath="url(#sll-team-badges-clip)">
        <path opacity="0.1" d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z" fill="#39639C" />
        <path d="M36.9391 25.3559C36.9391 27.6993 36.0082 29.9467 34.3512 31.6038C32.6941 33.2608 30.4467 34.1917 28.1033 34.1917C25.7599 34.1917 23.5125 33.2608 21.8554 31.6038C20.1984 29.9467 19.2675 27.6993 19.2675 25.3559C19.2675 23.0124 20.1984 20.765 21.8554 19.108C23.5125 17.4509 25.7599 16.52 28.1033 16.52C30.4467 16.52 32.6941 17.4509 34.3512 19.108C36.0082 20.765 36.9391 23.0124 36.9391 25.3559Z" stroke="#39639C" strokeWidth="1.56" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20.4494 29.6899L16.52 36.4969L20.765 35.3595L21.9042 39.6045L25.3131 33.6996M35.7677 29.6899L39.6971 36.4969L35.4504 35.3595L34.313 39.6045L30.9042 33.6996M28.4651 20.5582L29.6829 23.0078C29.7093 23.07 29.7521 23.124 29.8067 23.1638C29.8613 23.2037 29.9257 23.228 29.9931 23.2342L32.6976 23.6443C32.7751 23.6542 32.848 23.686 32.908 23.7359C32.9679 23.7858 33.0124 23.8518 33.0363 23.9261C33.06 24.0004 33.062 24.08 33.0422 24.1554C33.0223 24.2309 32.9813 24.2991 32.924 24.3521L30.9255 26.249C30.8955 26.3056 30.8798 26.3687 30.8798 26.4326C30.8798 26.4967 30.8955 26.5597 30.9255 26.6163L31.3088 29.3048C31.3255 29.3828 31.319 29.4638 31.2903 29.5382C31.2616 29.6124 31.2119 29.6768 31.1472 29.7234C31.0826 29.7699 31.0058 29.7965 30.9262 29.8002C30.8465 29.8037 30.7677 29.7839 30.6991 29.7435L28.2922 28.4705C28.23 28.4424 28.1626 28.4279 28.0943 28.4279C28.0261 28.4279 27.9587 28.4424 27.8965 28.4705L25.4896 29.7435C25.4211 29.7829 25.3426 29.8017 25.2637 29.7976C25.1847 29.7935 25.1086 29.7667 25.0446 29.7203C24.9805 29.674 24.9312 29.6101 24.9026 29.5364C24.874 29.4627 24.8673 29.3823 24.8834 29.3048L25.3363 26.6163C25.3559 26.554 25.3597 26.4878 25.3472 26.4236C25.3347 26.3595 25.3065 26.2995 25.2649 26.249L23.2699 24.336C23.2163 24.2824 23.1786 24.215 23.161 24.1412C23.1434 24.0675 23.1466 23.9903 23.1703 23.9182C23.1939 23.8462 23.2371 23.7821 23.295 23.7331C23.3528 23.6841 23.4232 23.6521 23.4981 23.6407L26.2009 23.2485C26.2683 23.2423 26.3327 23.218 26.3873 23.1781C26.4419 23.1382 26.4847 23.0843 26.5112 23.0221L27.7288 20.5724C27.7613 20.5029 27.8125 20.4439 27.8768 20.402C27.9411 20.3602 28.0159 20.3372 28.0925 20.3357C28.1693 20.3342 28.2449 20.3543 28.3107 20.3936C28.3765 20.4329 28.4301 20.4899 28.4651 20.5582Z" stroke="#39639C" strokeWidth="1.56" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="sll-team-badges-clip"><rect width="56" height="56" fill="white" /></clipPath>
      </defs>
    </svg>
  )
}

function IconStatusApproved({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 58 58"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g clipPath="url(#sll-status-approved-clip)">
        <path opacity="0.15" d="M29 58C45.0163 58 58 45.0163 58 29C58 12.9837 45.0163 0 29 0C12.9837 0 0 12.9837 0 29C0 45.0163 12.9837 58 29 58Z" fill="#08B1BA" />
        <path d="M16.9166 29L24.1666 36.25L41.0833 19.3333" stroke="#08B1BA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="sll-status-approved-clip"><rect width="58" height="58" fill="white" /></clipPath>
      </defs>
    </svg>
  )
}

function IconStatusPending({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 58 58"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g clipPath="url(#sll-status-pending-clip)">
        <path opacity="0.15" d="M29 58C45.0163 58 58 45.0163 58 29C58 12.9837 45.0163 0 29 0C12.9837 0 0 12.9837 0 29C0 45.0163 12.9837 58 29 58Z" fill="#FFC107" />
        <path d="M29 41.0834C35.6734 41.0834 41.0833 35.6735 41.0833 29C41.0833 22.3266 35.6734 16.9167 29 16.9167C22.3265 16.9167 16.9166 22.3266 16.9166 29C16.9166 35.6735 22.3265 41.0834 29 41.0834Z" stroke="#FFC107" strokeWidth="2.5" />
        <path d="M29 21.75V29L33.8333 31.4167" stroke="#FFC107" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="sll-status-pending-clip"><rect width="58" height="58" fill="white" /></clipPath>
      </defs>
    </svg>
  )
}

function IconStatusRejected({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 58 58"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g clipPath="url(#sll-status-rejected-clip)">
        <path opacity="0.15" d="M29 58C45.0163 58 58 45.0163 58 29C58 12.9837 45.0163 0 29 0C12.9837 0 0 12.9837 0 29C0 45.0163 12.9837 58 29 58Z" fill="#F16A1B" />
        <path d="M19.3334 19.3333L38.6667 38.6666M38.6667 19.3333L19.3334 38.6666" stroke="#F16A1B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="sll-status-rejected-clip"><rect width="58" height="58" fill="white" /></clipPath>
      </defs>
    </svg>
  )
}

function IconDeadlineCalendar({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g clipPath="url(#sll-deadline-calendar-clip)">
        <path
          d="M15.4853 8.72754C15.8576 8.96777 16.1894 9.24023 16.481 9.54492C16.7726 9.84961 17.0239 10.1836 17.2348 10.5469C17.4458 10.9102 17.6008 11.2939 17.7001 11.6982C17.7994 12.1025 17.8553 12.5156 17.8676 12.9375C17.8676 13.6348 17.7281 14.291 17.4489 14.9062C17.1697 15.5215 16.785 16.0576 16.2949 16.5146C15.8048 16.9717 15.2371 17.332 14.5919 17.5957C13.9467 17.8594 13.2518 17.9941 12.5074 18C11.9428 18 11.3969 17.9209 10.8695 17.7627C10.3422 17.6045 9.85818 17.376 9.41771 17.0771C8.97726 16.7783 8.5864 16.4209 8.24518 16.0049C7.90395 15.5889 7.64028 15.1289 7.45416 14.625H0V1.125H2.38235V0H3.57353V1.125H11.9118V0H13.1029V1.125H15.4853V8.72754ZM1.19118 2.25V4.5H14.2941V2.25H13.1029V3.375H11.9118V2.25H3.57353V3.375H2.38235V2.25H1.19118ZM7.17498 13.5C7.15637 13.3184 7.14706 13.1309 7.14706 12.9375C7.14706 12.4336 7.22151 11.9443 7.37041 11.4697C7.5193 10.9951 7.74575 10.5469 8.04975 10.125H7.14706V9H8.33824V9.75586C8.5926 9.45703 8.87489 9.19336 9.18508 8.96484C9.49532 8.73633 9.83033 8.54004 10.1901 8.37598C10.55 8.21191 10.9254 8.08887 11.3162 8.00684C11.707 7.9248 12.104 7.88086 12.5074 7.875C13.1277 7.875 13.7233 7.97168 14.2941 8.16504V5.625H1.19118V13.5H7.17498ZM12.5074 16.875C13.0843 16.875 13.6241 16.7725 14.1266 16.5674C14.6291 16.3623 15.0696 16.0811 15.448 15.7236C15.8266 15.3662 16.1243 14.9502 16.3415 14.4756C16.5586 14.001 16.6702 13.4883 16.6765 12.9375C16.6765 12.3926 16.5679 11.8828 16.3508 11.4082C16.1336 10.9336 15.8359 10.5176 15.4573 10.1602C15.0789 9.80273 14.6384 9.52148 14.1359 9.31641C13.6334 9.11133 13.0906 9.00586 12.5074 9C11.9304 9 11.3906 9.10254 10.8881 9.30762C10.3856 9.5127 9.94511 9.79395 9.56668 10.1514C9.18819 10.5088 8.89039 10.9248 8.67326 11.3994C8.45611 11.874 8.34444 12.3867 8.33824 12.9375C8.33824 13.4824 8.44681 13.9922 8.66395 14.4668C8.88109 14.9414 9.17889 15.3574 9.55736 15.7148C9.93579 16.0723 10.3763 16.3535 10.8788 16.5586C11.3813 16.7637 11.9242 16.8691 12.5074 16.875ZM13.1029 12.375H14.8897V13.5H11.9118V10.125H13.1029V12.375ZM2.38235 9H3.57353V10.125H2.38235V9ZM4.76471 9H5.95588V10.125H4.76471V9ZM4.76471 6.75H5.95588V7.875H4.76471V6.75ZM2.38235 11.25H3.57353V12.375H2.38235V11.25ZM4.76471 11.25H5.95588V12.375H4.76471V11.25ZM8.33824 7.875H7.14706V6.75H8.33824V7.875ZM10.7206 7.875H9.52941V6.75H10.7206V7.875ZM13.1029 7.875H11.9118V6.75H13.1029V7.875Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="sll-deadline-calendar-clip">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

function IconPedidosPendentes({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 35 35"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g clipPath="url(#sll-pending-clip)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M25.6796 0H9.29146C3.58048 0 0 4.04363 0 9.76597V25.207C0 30.9294 3.56157 34.973 9.29146 34.973H25.6777C31.4076 34.973 34.973 30.9294 34.973 25.207V9.76597C34.973 4.04363 31.4076 0 25.6796 0Z"
          fill="#3A57E8"
        />
        <path
          d="M20.4167 14.5834L14.5833 20.4167M14.5833 14.5834L20.4167 20.4167M9.57639 14.2139C9.43451 13.5747 9.45629 12.91 9.63972 12.2815C9.82321 11.6529 10.1624 11.0809 10.6259 10.6183C11.0894 10.1559 11.6621 9.81788 12.291 9.63575C12.92 9.45356 13.5847 9.43321 14.2236 9.57645C14.5753 9.02643 15.0597 8.57383 15.6323 8.26032C16.2049 7.94681 16.8472 7.78244 17.5 7.78244C18.1528 7.78244 18.7951 7.94681 19.3677 8.26032C19.9403 8.57383 20.4247 9.02643 20.7764 9.57645C21.4163 9.43256 22.0821 9.45285 22.7121 9.63543C23.342 9.81801 23.9155 10.157 24.3793 10.6207C24.8431 11.0845 25.182 11.658 25.3646 12.288C25.5471 12.9179 25.5675 13.5838 25.4236 14.2237C25.9736 14.5753 26.4262 15.0598 26.7397 15.6324C27.0533 16.2049 27.2176 16.8472 27.2176 17.5001C27.2176 18.1528 27.0533 18.7951 26.7397 19.3677C26.4262 19.9403 25.9736 20.4248 25.4236 20.7764C25.5669 21.4153 25.5464 22.0801 25.3643 22.709C25.1822 23.3379 24.8442 23.9107 24.3817 24.3742C23.9191 24.8376 23.3471 25.1769 22.7186 25.3603C22.09 25.5438 21.4253 25.5656 20.7861 25.4237C20.4349 25.9758 19.9501 26.4303 19.3765 26.7452C18.803 27.0601 18.1592 27.2252 17.5049 27.2252C16.8506 27.2252 16.2068 27.0601 15.6332 26.7452C15.0597 26.4303 14.5748 25.9758 14.2236 25.4237C13.5847 25.5669 12.92 25.5465 12.291 25.3644C11.6621 25.1822 11.0894 24.8442 10.6259 24.3817C10.1624 23.9192 9.82321 23.3471 9.63972 22.7186C9.45629 22.0901 9.43451 21.4254 9.57639 20.7862C9.02216 20.4354 8.56567 19.9502 8.24937 19.3757C7.93301 18.8011 7.76715 18.1559 7.76715 17.5001C7.76715 16.8441 7.93301 16.199 8.24937 15.6244C8.56567 15.0499 9.02216 14.5647 9.57639 14.2139Z"
          stroke="white"
          strokeWidth="1.99815"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="sll-pending-clip">
          <rect width="35" height="35" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

function IconAlertBell({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 36"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path d="M29.6543 17.468C28.5585 16.1884 28.0606 15.0796 28.0606 13.1957V12.5552C28.0606 10.1003 27.4956 8.5186 26.2672 6.93689C24.3739 4.48049 21.1866 3 18.0663 3H17.9337C14.879 3 11.7916 4.41251 9.86549 6.7692C8.56999 8.38263 7.93939 10.0323 7.93939 12.5552V13.1957C7.93939 15.0796 7.47426 16.1884 6.34573 17.468C5.51536 18.4107 5.25 19.6223 5.25 20.9336C5.25 22.2464 5.68084 23.4897 6.5455 24.5003C7.67403 25.7119 9.26768 26.4854 10.8956 26.6198C13.2526 26.8887 15.6095 26.99 18.0007 26.99C20.3905 26.99 22.7474 26.8208 25.1059 26.6198C26.7323 26.4854 28.326 25.7119 29.4545 24.5003C30.3177 23.4897 30.75 22.2464 30.75 20.9336C30.75 19.6223 30.4846 18.4107 29.6543 17.468Z" fill="currentColor" />
      <path opacity="0.4" d="M21.013 28.8425C20.2632 28.6824 15.6939 28.6824 14.944 28.8425C14.303 28.9906 13.6098 29.335 13.6098 30.0904C13.647 30.811 14.0689 31.447 14.6533 31.8504L14.6518 31.8519C15.4077 32.441 16.2947 32.8157 17.2235 32.9501C17.7184 33.0181 18.2223 33.0151 18.7351 32.9501C19.6624 32.8157 20.5494 32.441 21.3052 31.8519L21.3038 31.8504C21.8881 31.447 22.31 30.811 22.3473 30.0904C22.3473 29.335 21.6541 28.9906 21.013 28.8425Z" fill="currentColor" />
    </svg>
  )
}


function PendingRequestCard({ request }) {
  return (
    <article className="sll-request-row">
      <div className="sll-request-main">
        <h4>{request.title}</h4>
        <p className="sll-request-consultant">{request.consultant}</p>
        <div className={`sll-request-deadline is-${request.deadlineTone}`}>
          <IconDeadlineCalendar />
          <span>{request.deadline}</span>
        </div>
      </div>

      <div className="sll-request-badge" aria-hidden="true">
        {request.image
          ? <img src={request.image} alt="" />
          : request.badgeLabel
        }
      </div>
    </article>
  )
}

function resolveImagem(imagem_badge) {
  if (!imagem_badge) return null
  if (imagem_badge.startsWith('data:')) return imagem_badge
  return `data:image/png;base64,${imagem_badge}`
}

function textoDeadline(diasRestantes) {
  if (diasRestantes < 0) return `Tempo limite expirado há ${Math.abs(diasRestantes)} dias`
  if (diasRestantes === 0) return 'Tempo limite termina hoje'
  return `Tempo limite de resposta termina em ${diasRestantes} ${diasRestantes === 1 ? 'dia' : 'dias'}`
}

function calcularDeadlineTone(diasRestantes) {
  return diasRestantes <= 5 ? 'danger' : 'info'
}

const RANK_MAP = ['gold', 'silver', 'bronze']
const RANK_LABEL = ['1o', '2o', '3o']


function SLLDashboard() {
  const topbarRef = useRef(null)
  const [dados, setDados] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    getDashboardSLL()
      .then(setDados)
      .catch(() => setErro('Não foi possível carregar o dashboard.'))
      .finally(() => setLoading(false))
  }, [])

  function handleOpenNotifications() {
    topbarRef.current?.openNotifications()
  }

  if (loading) return <p className="sll-loading">A carregar...</p>
  if (erro) return <p className="sll-error">{erro}</p>

  // Pedidos pendentes
  const pendingRequests = (dados.proximos_pedidos_expirar ?? []).map(pedido => ({
    title: `${pedido.nome_badge} - ${pedido.nivel_badge}`,
    consultant: pedido.nome_consultor,
    deadline: textoDeadline(pedido.tempo_resposta_dias),
    deadlineTone: calcularDeadlineTone(pedido.tempo_resposta_dias),
    image: resolveImagem(pedido.imagem_badge),
  }))

  // Cards de estado
  const teamStatusCards = [
    { label: 'Aprovados', value: `${Math.round(dados.percentagem_estados.aprovados)}%`, Icon: IconStatusApproved, tone: 'approved' },
    { label: 'Pendentes', value: `${Math.round(dados.percentagem_estados.pendentes)}%`, Icon: IconStatusPending, tone: 'pending' },
    { label: 'Rejeitados', value: `${Math.round(dados.percentagem_estados.rejeitados)}%`, Icon: IconStatusRejected, tone: 'rejected' },
  ]

  // Top consultores
  const topConsultants = (dados.top_consultores ?? []).map((consultor, i) => ({
    name: consultor.nome_consultor,
    badges: `${consultor.total_badges} badges`,
    rank: RANK_LABEL[i],
    rankTone: RANK_MAP[i],
    profilePath: `/sll/perfil-publico?name=${encodeURIComponent(consultor.nome_consultor)}`,
  }))

  return (
    <div className="sll-homepage">
      <SLLSidebar />
      <main className="sll-main-content">
        <SLLTopbar ref={topbarRef} />
        <div className="sll-main-scroll">

          <section className="sll-hero" aria-label="Resumo de boas-vindas">
            <div className="sll-hero-copy">
              <h1>Olá, {dados.nome_service_line_lider}!</h1>
              <p>{dados.nome_service_line}</p>
            </div>
          </section>

          {/* Notificações — count ainda não vem da API, manter neutro */}
          <button
            type="button"
            className="sll-alert-card"
            aria-label="Abrir notificações"
            onClick={handleOpenNotifications}
          >
            <div className="sll-alert-icon"><IconAlertBell /></div>
            <div className="sll-alert-copy">
              <h3>Tem alertas por ler</h3>
              <p>Aceda agora aos alertas</p>
            </div>
          </button>

          <section className="sll-dashboard-grid">
            <article className="sll-card sll-pending-card">
              <header className="sll-card-header">
                <div className="sll-title-wrap">
                  <IconPedidosPendentes className="sll-title-icon-svg" />
                  <h3>Pedidos Pendentes</h3>
                </div>
                <Link className="sll-link-btn" to="/sll/pendentes">Ver todos</Link>
              </header>
              <div className="sll-request-list">
                {pendingRequests.map((request, i) => (
                  <PendingRequestCard key={i} request={request} />
                ))}
              </div>
            </article>

            <div className="sll-status-column">
              {teamStatusCards.map((statusCard) => {
                const Icon = statusCard.Icon
                return (
                  <article className="sll-card sll-status-card" key={statusCard.label}>
                    <Icon className={`sll-status-icon-svg is-${statusCard.tone}`} />
                    <div>
                      <p>{statusCard.label}</p>
                      <strong>{statusCard.value}</strong>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="sll-bottom-grid">
            <article className="sll-card sll-top-consultants-card">
              <h3>Top 3 Consultores</h3>
              <div className="sll-top-list">
                {topConsultants.map((consultant) => (
                  <Link
                    className="sll-top-item"
                    key={consultant.rank}
                    to={consultant.profilePath}
                    aria-label={`Ver perfil público de ${consultant.name}`}
                  >
                    <div className="sll-top-main">
                      <span className="sll-top-avatar" aria-hidden="true">
                        <FaUserCircle />
                      </span>
                      <div>
                        <h4>{consultant.name}</h4>
                        <p>{consultant.badges}</p>
                      </div>
                    </div>
                    <span className={`sll-rank-badge is-${consultant.rankTone}`}>{consultant.rank}</span>
                  </Link>
                ))}
              </div>
            </article>

            <article className="sll-card sll-team-card">
              <header className="sll-team-header">
                <h3>Service Line Pessoal</h3>
              </header>
              <div className="sll-team-stats">
                <article className="sll-team-stat">
                  <IconTeamConsultores className="sll-team-stat-icon-svg" />
                  <div className="sll-team-stat-copy">
                    <strong>{dados.total_consultores}</strong>
                    <p>Consultores</p>
                  </div>
                </article>
                <article className="sll-team-stat">
                  <IconTeamBadges className="sll-team-stat-icon-svg" />
                  <div className="sll-team-stat-copy">
                    <strong>{dados.total_badges}</strong>
                    <p>Badges Conquistados</p>
                  </div>
                </article>
              </div>
            </article>
          </section>

        </div>
      </main>
    </div>
  )
}

export default SLLDashboard
