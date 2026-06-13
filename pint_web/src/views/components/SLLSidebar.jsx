import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FaFileAlt } from 'react-icons/fa'
import './softinsa-sidebar.css'

function DashboardSquareIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={`softinsa-sidebar-item-icon${props.className ? ` ${props.className}` : ''}`} aria-hidden="true">
      <path opacity="0.4" d="M16.0755 2H19.4615C20.8637 2 22 3.14585 22 4.55996V7.97452C22 9.38864 20.8637 10.5345 19.4615 10.5345H16.0755C14.6732 10.5345 13.537 9.38864 13.537 7.97452V4.55996C13.537 3.14585 14.6732 2 16.0755 2Z" fill="currentColor" />
      <path d="M7.9248 13.4658C9.3269 13.466 10.4628 14.6114 10.4629 16.0254V19.4404C10.4627 20.8533 9.3268 21.9998 7.9248 22H4.53809C3.13615 21.9998 2.00021 20.8533 2 19.4404V16.0254C2.00005 14.6115 3.13605 13.4661 4.53809 13.4658H7.9248ZM19.4619 13.4658C20.864 13.4661 22 14.6115 22 16.0254V19.4404C21.9998 20.8533 20.8639 21.9998 19.4619 22H16.0752C14.6732 21.9998 13.5373 20.8533 13.5371 19.4404V16.0254C13.5372 14.6114 14.6731 13.466 16.0752 13.4658H19.4619ZM7.9248 2C9.3268 2.00017 10.4627 3.14575 10.4629 4.55957V7.97461C10.4628 9.38858 9.3269 10.534 7.9248 10.5342H4.53809C3.13605 10.5339 2.00005 9.38853 2 7.97461V4.55957C2.00021 3.14579 3.13615 2.00024 4.53809 2H7.9248Z" fill="currentColor" />
    </svg>
  )
}

function PendingDocIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={`softinsa-sidebar-item-icon${props.className ? ` ${props.className}` : ''}`} aria-hidden="true">
      <path d="M5.25 1.5C5.05109 1.5 4.86032 1.57902 4.71967 1.71967C4.57902 1.86032 4.5 2.05109 4.5 2.25V21.75C4.5 21.9489 4.57902 22.1397 4.71967 22.2803C4.86032 22.421 5.05109 22.5 5.25 22.5H9.75V21H6V3H18V10.5H19.5V2.25C19.5 2.05109 19.421 1.86032 19.2803 1.71967C19.1397 1.57902 18.9489 1.5 18.75 1.5H5.25Z" fill="currentColor" />
      <path opacity="0.4" d="M7.5 7.5H16.5V6H7.5V7.5ZM7.5 10.5H13.5V9H7.5V10.5Z" fill="currentColor" />
      <path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M15.75 12C14.3576 12 13.0223 12.5531 12.0377 13.5377C11.0531 14.5223 10.5 15.8576 10.5 17.25C10.5 18.6424 11.0531 19.9777 12.0377 20.9623C13.0223 21.9469 14.3576 22.5 15.75 22.5C17.1424 22.5 18.4777 21.9469 19.4623 20.9623C20.4469 19.9777 21 18.6424 21 17.25C21 15.8576 20.4469 14.5223 19.4623 13.5377C18.4777 12.5531 17.1424 12 15.75 12ZM15 14.25V17.25C14.9998 17.3486 15.0191 17.4462 15.0567 17.5373C15.0942 17.6284 15.1494 17.7112 15.219 17.781L17.469 20.031L18.531 18.969L16.5 16.9395V14.25H15Z" fill="currentColor" />
    </svg>
  )
}

function BriefcaseIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={`softinsa-sidebar-item-icon${props.className ? ` ${props.className}` : ''}`} aria-hidden="true">
      <path d="M21 3H3C2.44772 3 2 3.44772 2 4V7C2 7.55228 2.44772 8 3 8H21C21.5523 8 22 7.55228 22 7V4C22 3.44772 21.5523 3 21 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 8V19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21H18C18.5304 21 19.0391 20.7893 19.4142 20.4142C19.7893 20.0391 20 19.5304 20 19V8M10 12H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TeamUsersIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={`softinsa-sidebar-item-icon${props.className ? ` ${props.className}` : ''}`} aria-hidden="true">
      <path d="M11.949 14.5399C8.49904 14.5399 5.58809 15.1037 5.58809 17.2794C5.58809 19.4561 8.51785 20 11.949 20C15.399 20 18.31 19.4362 18.31 17.2605C18.31 15.0839 15.3802 14.5399 11.949 14.5399Z" fill="currentColor" />
      <path opacity="0.4" d="M11.949 12.467C14.2851 12.467 16.1583 10.5831 16.1583 8.23351C16.1583 5.88306 14.2851 4 11.949 4C9.61292 4 7.73974 5.88306 7.73974 8.23351C7.73974 10.5831 9.61292 12.467 11.949 12.467Z" fill="currentColor" />
      <path opacity="0.4" d="M21.088 9.21926C21.6924 6.84179 19.9204 4.70657 17.6639 4.70657C17.4186 4.70657 17.184 4.73359 16.9548 4.77952C16.9243 4.78672 16.8903 4.80203 16.8724 4.82905C16.8518 4.86327 16.867 4.9092 16.8894 4.93892C17.5672 5.89531 17.9567 7.05973 17.9567 8.3097C17.9567 9.50744 17.5995 10.6241 16.9727 11.5508C16.9082 11.6463 16.9655 11.775 17.0792 11.7949C17.2368 11.8228 17.398 11.8372 17.5628 11.8417C19.2058 11.8849 20.6806 10.8213 21.088 9.21926Z" fill="currentColor" />
      <path d="M22.8093 14.8169C22.5084 14.1721 21.7823 13.73 20.6782 13.5129C20.1571 13.385 18.7468 13.2049 17.4351 13.2292C17.4154 13.2319 17.4046 13.2455 17.4028 13.2545C17.4002 13.2671 17.4055 13.2887 17.4315 13.3022C18.0377 13.6039 20.3809 14.916 20.0864 17.6834C20.0738 17.8032 20.1696 17.9067 20.2887 17.8887C20.8654 17.8059 22.349 17.4853 22.8093 16.4866C23.0636 15.9588 23.0636 15.3456 22.8093 14.8169Z" fill="currentColor" />
      <path opacity="0.4" d="M7.04482 4.77979C6.81649 4.73296 6.581 4.70685 6.33566 4.70685C4.07924 4.70685 2.30724 6.84207 2.91253 9.21953C3.31905 10.8216 4.79377 11.8852 6.43684 11.842C6.60159 11.8375 6.76366 11.8221 6.92036 11.7951C7.03407 11.7753 7.09138 11.6465 7.02691 11.5511C6.40013 10.6235 6.04286 9.50771 6.04286 8.30997C6.04286 7.0591 6.43326 5.89468 7.11108 4.93919C7.13257 4.90947 7.14868 4.86354 7.12719 4.82932C7.10929 4.80141 7.07616 4.787 7.04482 4.77979Z" fill="currentColor" />
      <path d="M3.32156 13.5127C2.21752 13.7297 1.49225 14.1719 1.19139 14.8167C0.936203 15.3453 0.936203 15.9586 1.19139 16.4872C1.65163 17.485 3.13531 17.8065 3.71195 17.8885C3.83104 17.9065 3.92595 17.8038 3.91342 17.6831C3.61883 14.9166 5.9621 13.6045 6.56918 13.3028C6.59425 13.2884 6.59962 13.2677 6.59694 13.2542C6.59515 13.2452 6.5853 13.2317 6.5656 13.2299C5.25294 13.2047 3.84358 13.3848 3.32156 13.5127Z" fill="currentColor" />
    </svg>
  )
}

function BadgeCircleIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={`softinsa-sidebar-item-icon${props.className ? ` ${props.className}` : ''}`} aria-hidden="true">
      <g clipPath="url(#clip0_4790_653)">
        <path d="M20.4909 9.3977C20.4909 11.651 19.5957 13.812 18.0024 15.4053C16.4091 16.9986 14.2481 17.8937 11.9949 17.8937C9.74158 17.8937 7.58059 16.9986 5.98728 15.4053C4.39397 13.812 3.49886 11.651 3.49886 9.3977C3.49886 7.14442 4.39397 4.98343 5.98728 3.39012C7.58059 1.79681 9.74158 0.901703 11.9949 0.901703C14.2481 0.901703 16.4091 1.79681 18.0024 3.39012C19.5957 4.98343 20.4909 7.14442 20.4909 9.3977Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.63543 13.5651L0.85714 20.1103L4.93885 19.0166L6.03428 23.0983L9.312 17.4206M19.3646 13.5651L23.1429 20.1103L19.0594 19.0166L17.9657 23.0983L14.688 17.4206M12.3429 4.78456L13.5137 7.13999C13.5391 7.19983 13.5803 7.25167 13.6328 7.29001C13.6853 7.32834 13.7473 7.35173 13.812 7.3577L16.4126 7.75199C16.487 7.7615 16.5571 7.79205 16.6148 7.84005C16.6725 7.88805 16.7152 7.9515 16.7381 8.02296C16.761 8.09442 16.763 8.17091 16.7439 8.24347C16.7248 8.31602 16.6854 8.38162 16.6303 8.43256L14.7086 10.2566C14.6797 10.311 14.6647 10.3716 14.6647 10.4331C14.6647 10.4947 14.6797 10.5553 14.7086 10.6097L15.0771 13.1948C15.0931 13.2698 15.087 13.3477 15.0594 13.4192C15.0318 13.4906 14.984 13.5525 14.9218 13.5973C14.8596 13.642 14.7857 13.6676 14.7092 13.6711C14.6327 13.6745 14.5568 13.6556 14.4909 13.6166L12.1766 12.3926C12.1168 12.3656 12.0519 12.3516 11.9863 12.3516C11.9207 12.3516 11.8558 12.3656 11.796 12.3926L9.48171 13.6166C9.41583 13.6545 9.34039 13.6726 9.26447 13.6686C9.18856 13.6647 9.1154 13.6389 9.0538 13.5943C8.99221 13.5498 8.94482 13.4884 8.91733 13.4175C8.88984 13.3466 8.88342 13.2693 8.89885 13.1948L9.33428 10.6097C9.35317 10.5498 9.35679 10.4861 9.34482 10.4244C9.33284 10.3628 9.30565 10.3051 9.26571 10.2566L7.34742 8.41713C7.29587 8.36557 7.25963 8.30073 7.24271 8.22981C7.2258 8.15889 7.22888 8.08467 7.25162 8.01539C7.27436 7.94612 7.31586 7.88451 7.3715 7.8374C7.42715 7.7903 7.49478 7.75954 7.56685 7.74856L10.1657 7.37142C10.2305 7.36545 10.2924 7.34205 10.3449 7.30372C10.3974 7.26539 10.4386 7.21355 10.464 7.1537L11.6349 4.79827C11.666 4.73142 11.7153 4.67465 11.7771 4.63441C11.839 4.59418 11.9108 4.57209 11.9846 4.57066C12.0583 4.56923 12.131 4.58852 12.1943 4.62633C12.2577 4.66414 12.3091 4.71896 12.3429 4.78456Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_4790_653">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

function ReportClipboardIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={`softinsa-sidebar-item-icon${props.className ? ` ${props.className}` : ''}`} aria-hidden="true">
      <path opacity="0.4" d="M7.5 13.5H13.5V15H7.5V13.5ZM7.5 9.75H16.5V11.25H7.5V9.75ZM7.5 17.25H11.25V18.75H7.5V17.25Z" fill="currentColor" />
      <path d="M18.75 3.75H16.5V3C16.5 2.60218 16.342 2.22064 16.0607 1.93934C15.7794 1.65804 15.3978 1.5 15 1.5H9C8.60218 1.5 8.22064 1.65804 7.93934 1.93934C7.65804 2.22064 7.5 2.60218 7.5 3V3.75H5.25C4.85218 3.75 4.47064 3.90804 4.18934 4.18934C3.90804 4.47064 3.75 4.85218 3.75 5.25V21C3.75 21.3978 3.90804 21.7794 4.18934 22.0607C4.47064 22.342 4.85218 22.5 5.25 22.5H18.75C19.1478 22.5 19.5294 22.342 19.8107 22.0607C20.092 21.7794 20.25 21.3978 20.25 21V5.25C20.25 4.85218 20.092 4.47064 19.8107 4.18934C19.5294 3.90804 19.1478 3.75 18.75 3.75ZM9 3H15V6H9V3ZM18.75 21H5.25V5.25H7.5V7.5H16.5V5.25H18.75V21Z" fill="currentColor" />
    </svg>
  )
}

const sidebarSections = [
  {
    title: 'Home',
    items: [{ text: 'Dashboard', icon: DashboardSquareIcon, to: '/sll', link: true, end: true }],
  },
  {
    title: 'Pedidos',
    items: [
      { text: 'Pendentes', icon: PendingDocIcon, to: '/sll/pendentes', link: true },
      { text: 'Histórico', icon: BriefcaseIcon, to: '/sll/historico', link: true },
    ],
  },
  {
    title: 'Gestão',
    items: [
      { text: 'A minha equipa', icon: TeamUsersIcon, to: '/sll/equipa', link: true },
      { text: 'Badges', icon: BadgeCircleIcon, to: '/sll/badges', link: true },
      { text: 'Certificados', icon: ReportClipboardIcon, to: '/sll/certificados', link: true },
      { text: 'Relatórios', icon: FaFileAlt, to: '/sll/relatorios', link: true },
    ],
  },
]

function MenuTitle({ text }) {
  return (
    <div className="softinsa-sidebar-title">
      <span>{text}</span>
    </div>
  )
}

function SidebarIcon({ Icon, color }) {
  return <Icon className="softinsa-sidebar-item-icon" style={{ color }} aria-hidden="true" />
}

function MenuItem({ text, icon, active = false, to, end = false, link = false }) {
  if (link) {
    return (
      <NavLink to={to} end={end} className={({ isActive }) => `softinsa-sidebar-item${isActive ? ' active' : ''}`}>
        {({ isActive }) => (
          <>
            <span className="softinsa-sidebar-item-icon-wrap">
              <SidebarIcon Icon={icon} color={isActive ? '#ffffff' : '#8a92a6'} />
            </span>
            <span className="softinsa-sidebar-item-text">{text}</span>
          </>
        )}
      </NavLink>
    )
  }

  return (
    <button type="button" className={`softinsa-sidebar-item${active ? ' active' : ''}`}>
      <span className="softinsa-sidebar-item-icon-wrap">
        <SidebarIcon Icon={icon} color="#8a92a6" />
      </span>
      <span className="softinsa-sidebar-item-text">{text}</span>
    </button>
  )
}

function SectionDivider() {
  return <div className="softinsa-sidebar-divider" />
}

function SLLSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (window.innerWidth < 768) return true
    return localStorage.getItem('softinsa-sidebar-collapsed') === 'true'
  })

  useEffect(() => {
    localStorage.setItem('softinsa-sidebar-collapsed', String(isCollapsed))
  }, [isCollapsed])

  useEffect(() => {
    function onResize() {
      if (window.innerWidth < 768) setIsCollapsed(true)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  function toggleSidebar() {
    setIsCollapsed((previousValue) => !previousValue)
  }

  return (
    <aside className={`softinsa-sidebar-shell${isCollapsed ? ' is-collapsed' : ''}`}>
      <button className="softinsa-sidebar-toggle" type="button" onClick={toggleSidebar} aria-label={isCollapsed ? 'Abrir sidebar' : 'Fechar sidebar'} aria-expanded={!isCollapsed}>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" className="softinsa-sidebar-toggle-arrow" aria-hidden="true">
          <path d="M3.18752 9.20553L14.4375 9.20553" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7.72496 13.724L3.18746 9.20595L7.72496 4.6872" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="softinsa-sidebar-panel">
        <div className="softinsa-sidebar-header">
            <NavLink to="/" className="softinsa-sidebar-logo-pill" aria-label="Ir para a página inicial">
              <span className="softinsa-sidebar-logo-text">
                <svg xmlns="http://www.w3.org/2000/svg" width="204" height="69" viewBox="0 0 204 69" fill="none">
                  <g filter="url(#filter0_d_3792_2491)">
                    <rect x="10" y="10" width="184" height="49" rx="24.5" fill="white" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M33.1185 28.7738C33.0955 28.2401 32.9578 27.7177 32.7149 27.2423C32.4719 26.7669 32.1295 26.3498 31.711 26.0193C30.8991 25.4164 29.6813 25.1146 28.0575 25.1139C25.0633 25.1139 23.5663 26.0922 23.5667 28.0487C23.5673 28.3958 23.6527 28.7375 23.8153 29.0439C23.9779 29.3503 24.2129 29.6121 24.4997 29.8064C25.4069 30.3954 26.4226 30.796 27.4868 30.9845C29.1102 31.3463 30.5183 31.6842 31.711 31.9984C32.8256 32.2866 33.9196 32.6497 34.9856 33.0853C35.5385 33.3005 36.0673 33.5736 36.5631 33.9C37.054 34.222 37.4802 34.6336 37.8194 35.1135C38.1844 35.6448 38.4607 36.2322 38.6375 36.8525C38.8566 37.6548 38.9592 38.4845 38.9421 39.3161C38.9624 40.3919 38.7002 41.4542 38.1817 42.3963C37.6702 43.2931 36.9684 44.0662 36.126 44.6607C35.2005 45.3059 34.1699 45.7843 33.0806 46.0744C31.8783 46.4047 30.6368 46.569 29.3902 46.5629C25.7112 46.5629 22.9459 45.8866 21.0941 44.534C19.2423 43.1815 18.2653 41.1769 18.1631 38.5201H23.2621C23.2603 39.1 23.4041 39.6711 23.6801 40.1806C23.9562 40.6902 24.3556 41.122 24.8417 41.4361C25.9885 42.1837 27.3378 42.5574 28.7046 42.5058C30.3793 42.5058 31.6479 42.2156 32.5104 41.6352C32.9125 41.3904 33.2436 41.0441 33.4706 40.6308C33.6976 40.2176 33.8126 39.7518 33.8041 39.2801C33.8078 38.9185 33.7565 38.5585 33.6518 38.2125C33.5387 37.8685 33.335 37.5614 33.0624 37.3238C32.7064 37.021 32.3009 36.7823 31.8638 36.6179C31.2211 36.3744 30.5587 36.1864 29.884 36.056C27.956 35.6706 26.288 35.2783 24.8801 34.879C23.6525 34.5586 22.479 34.0578 21.3976 33.3928C20.5458 32.8675 19.8495 32.1233 19.3809 31.2373C18.9149 30.2286 18.6935 29.1236 18.7348 28.0127C18.7287 27.0529 18.9235 26.1024 19.3066 25.2228C19.6988 24.3377 20.2987 23.5608 21.0551 22.9584C21.9232 22.275 22.9102 21.7589 23.9658 21.4363C25.2924 21.0372 26.6728 20.8476 28.0575 20.8744C29.4478 20.8562 30.8331 21.0456 32.1679 21.4363C33.3036 21.7689 34.3682 22.3093 35.3078 23.0303C36.1668 23.699 36.8632 24.5545 37.3443 25.5325C37.8342 26.5453 38.1062 27.6502 38.1427 28.7753L33.1185 28.7738Z" fill="#39639C" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M53.7852 42.2503C54.6959 42.2558 55.5994 42.09 56.4491 41.7614C57.2812 41.4388 58.0294 40.931 58.6373 40.2762C59.3009 39.5394 59.8003 38.6692 60.1021 37.7235C60.4809 36.5295 60.6613 35.281 60.6359 34.0282C60.6359 31.1786 60.0522 29.0167 58.8847 27.5425C57.7173 26.0683 56.0177 25.3316 53.7858 25.3323C51.5525 25.3323 49.8398 26.069 48.6478 27.5425C47.4558 29.016 46.8593 31.1774 46.8582 34.0267C46.8582 36.8763 47.4608 38.9595 48.666 40.2762C49.8712 41.593 51.5776 42.251 53.7852 42.2503ZM53.7852 46.5623C49.8779 46.5623 46.8776 45.4753 44.7843 43.3012C42.691 41.1271 41.6444 37.9995 41.6444 33.9182C41.6183 32.0627 41.8882 30.2149 42.4438 28.4448C42.9231 26.9186 43.7282 25.5155 44.803 24.333C45.8614 23.1981 47.1629 22.319 48.6093 21.7621C50.2637 21.1428 52.0197 20.8422 53.7852 20.8759C55.5441 20.8457 57.293 21.1463 58.9414 21.7621C60.3902 22.3127 61.688 23.2004 62.728 24.3523C63.7817 25.5579 64.5726 26.971 65.0498 28.5011C65.6059 30.289 65.8755 32.154 65.8487 34.0267C65.8487 38.1809 64.8148 41.3085 62.7472 43.4096C60.6795 45.5107 57.6922 46.5616 53.7852 46.5623Z" fill="#39639C" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M97.0174 45.7299V25.8745H89.4053V21.6719H109.957L106.237 25.8745H102.308V45.7299H97.0174Z" fill="#00B8E0" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M110.059 45.7299V25.8755L113.78 21.6719H115.349V45.7299H110.059Z" fill="#00B8E0" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M110.059 45.7299V25.8755L113.78 21.6719H115.349V45.7299H110.059Z" fill="black" fillOpacity="0.2" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M110.059 45.7299V25.8755L113.78 21.6719H115.349V45.7299H110.059Z" fill="black" fillOpacity="0.2" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M110.059 45.7299V25.8755L113.78 21.6719H115.349V45.7299H110.059Z" fill="#00B8E0" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M134.699 45.7299L123.891 29.5703V45.7299H118.981V21.6719H124.575L134.623 37.1429V21.6719H139.569V45.7299H134.699Z" fill="#39639C" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M134.699 45.7299L123.891 29.5703V45.7299H118.981V21.6719H124.575L134.623 37.1429V21.6719H139.569V45.7299H134.699Z" fill="black" fillOpacity="0.2" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M157.496 28.7738C157.472 28.2401 157.334 27.7178 157.091 27.2424C156.848 26.7671 156.506 26.3499 156.087 26.0193C155.275 25.4164 154.058 25.1146 152.434 25.1139C149.441 25.1139 147.944 26.0921 147.943 28.0487C147.944 28.3957 148.029 28.7374 148.192 29.0438C148.354 29.3501 148.589 29.612 148.876 29.8064C149.783 30.3955 150.799 30.796 151.863 30.9845C153.486 31.3463 154.894 31.6842 156.087 31.9984C157.202 32.2868 158.296 32.6499 159.362 33.0852C159.915 33.3006 160.444 33.5738 160.941 33.9005C161.432 34.2225 161.858 34.6341 162.197 35.114C162.562 35.6456 162.838 36.2329 163.015 36.853C163.233 37.6554 163.336 38.4851 163.318 39.3166C163.339 40.3924 163.077 41.4548 162.559 42.3968C162.047 43.2938 161.345 44.0668 160.503 44.6612C159.578 45.3064 158.547 45.7847 157.458 46.0744C156.256 46.4048 155.014 46.5691 153.768 46.5628C150.089 46.5628 147.324 45.8866 145.472 44.534C143.62 43.1815 142.642 41.1768 142.538 38.5201H147.639C147.637 39.0998 147.78 39.6706 148.056 40.1801C148.332 40.6897 148.731 41.1216 149.216 41.4361C150.364 42.1835 151.713 42.5571 153.08 42.5057C154.755 42.5057 156.024 42.2156 156.886 41.6352C157.288 41.3905 157.619 41.0442 157.846 40.631C158.073 40.2177 158.188 39.7519 158.18 39.2801C158.183 38.9186 158.132 38.5586 158.027 38.2125C157.914 37.8685 157.711 37.5615 157.438 37.3237C157.082 37.021 156.676 36.7822 156.239 36.6179C155.597 36.3746 154.935 36.1866 154.261 36.056C152.331 35.6706 150.663 35.2782 149.255 34.8789C148.028 34.5588 146.854 34.058 145.773 33.3928C144.921 32.8675 144.224 32.1233 143.754 31.2373C143.289 30.2287 143.067 29.124 143.108 28.0132C143.102 27.0534 143.296 26.1029 143.68 25.2233C144.073 24.3381 144.673 23.5612 145.43 22.9589C146.299 22.2759 147.285 21.7598 148.341 21.4368C149.668 21.0375 151.049 20.8477 152.434 20.8743C153.824 20.8562 155.209 21.0456 156.544 21.4363C157.679 21.7692 158.744 22.3096 159.684 23.0303C160.542 23.6992 161.238 24.5548 161.719 25.5325C162.209 26.5454 162.481 27.6502 162.518 28.7753L157.496 28.7738Z" fill="#39639C" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M176.409 27.0708H176.373L173.138 36.6352H179.57L176.409 27.0708ZM182.69 45.7325L181.091 40.7684H171.768L169.98 45.7325H164.384L173.403 21.6719H179.53L188.436 45.7299L182.69 45.7325Z" fill="#39639C" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M74.203 35.5843V45.7299H68.9133V31.3452H85.3158V35.5843H74.203Z" fill="#39639C" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M68.9133 25.8745H86.9151V21.6719H68.9133V25.8745Z" fill="#39639C" />
                  </g>
                  <defs>
                    <filter id="filter0_d_3792_2491" x="0" y="0" width="204" height="69" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset />
                      <feGaussianBlur stdDeviation="5" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3792_2491" />
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3792_2491" result="shape" />
                    </filter>
                  </defs>
                </svg>
              </span>
          </NavLink>
        </div>

        <div className="softinsa-sidebar-top-line" />

        <div className="softinsa-sidebar-sections">
          {sidebarSections.map((section) => (
            <div className="softinsa-sidebar-section" key={section.title}>
              <MenuTitle text={section.title} />

              {section.items.map((item) => (
                <MenuItem
                  key={item.text}
                  text={item.text}
                  icon={item.icon}
                  active={item.active === true}
                  to={item.to}
                  end={item.end === true}
                  link={item.link === true}
                />
              ))}

              <SectionDivider />
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default SLLSidebar