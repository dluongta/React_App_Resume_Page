import React, { useEffect } from 'react';
import logo_brand from '../../assets/luen-1.jpg';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
export const Footer = () => {
  useEffect(() => {
    const year = new Date().getFullYear();
    const el = document.getElementById('currentYear');
    if (el) el.textContent = year;
  }, []);

  // const currentDate = new Date().toLocaleDateString('en-GB', {
  //   day: '2-digit',
  //   month: 'long',
  //   year: 'numeric',
  // });
  // Hàm xử lý lấy hậu tố (st, nd, rd, th) cho ngày
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th'; // Các ngày từ 4 đến 20 đều là 'th'
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  // Tạo định dạng ngày tháng chuẩn Anh-Mỹ có hậu tố
  const today = new Date();
  const dayNum = today.getDate();
  const suffix = getOrdinalSuffix(dayNum);
  const monthName = today.toLocaleDateString('en-US', { month: 'long' }); // Ví dụ: "May"
  const yearNum = today.getFullYear();

  // Kết quả ra dạng: "22nd May 2026" (Chuẩn Anh) hoặc bạn có thể đổi vị trí thành `${monthName} ${dayNum}${suffix}, ${yearNum}` (Chuẩn Mỹ)
  // const currentDate = `${dayNum}${suffix} ${monthName} ${yearNum}`;
  const currentDate = `${monthName} ${dayNum}${suffix}, ${yearNum}`;
  return (
    <footer>
      <div className="container grid1">
        <div className="box">
          <img width="95" height="60" src={logo_brand} alt='' />
          <p className="brand-title-1">DLUONGTA - TSCEND</p>
          <div className="socialIcon">
            <Link className='white' to={{ pathname: 'https://www.facebook.com/dluongta' }} target="_blank"><i className='fab fa-facebook-f'></i></Link>
            <Link className='white' to={{ pathname: 'https://www.instagram.com/dluongta/' }} target="_blank"> <i className='fab fa-instagram '></i></Link>
            <Link className='white' to={{ pathname: 'https://www.linkedin.com/in/dinh-luong-ta-940ba2286/' }} target="_blank"><i className='fab fa-brands fa-linkedin'></i></Link>
            <Link className='white' to={{ pathname: 'https://www.youtube.com/@dinhluongta' }} target="_blank"><i className='fab fa-youtube'></i></Link>
            <Link className='white' to={{ pathname: 'https://www.tiktok.com/@dluongta_' }} target="_blank"><i className='fab fa-brands fa-tiktok'></i></Link>
            <Link className='white' to={{ pathname: 'https://github.com/dluongta' }} target="_blank"><i className='fab fa-brands fa-github'></i></Link>

          </div>
        </div>
        <div className="box">
          <h2 className='quick-link'>Quick Links</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/web">Web</Link></li>
            <li><Link to="/android">Android</Link></li>
            <li><Link to="/app">App</Link></li>
            <li><Link to="/resume">Resume</Link></li>
            {/* <li><Link to="/galaxy">Galaxy</Link></li> */}

          </ul>
        </div>
        <div className="box">
          <h2 className='margin-1'>Recent Post</h2>
          <ul>
            {[1, 2, 3].map((i) => (
              <li key={i} className="text" style={{ listStyle: 'none' }}>
                <p style={{ display: 'inline', fontSize: '16px' }}>Latest News</p>
                <br />
                <span style={{ display: 'inline', fontSize: '15px' }}>{currentDate}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="box">
          <h2 className='margin-2'>Get In Touch</h2>
          <p className="brand-title-2">"DLUONGTA TSCEND"</p>
          <div className="icon"><i className="fa fa-map-marker-alt"></i><span>Location: Hanoi, Vietnam</span></div>
          <div className="icon"><i className="fa fa-phone"></i><a href="tel:+84383402036">Phone: +84 383402036</a></div>
          <div className="icon"><i className="fa fa-envelope"></i><a href="mailto:dluongta@gmail.com">Email: dluongta@gmail.com</a></div>
        </div>
      </div>
      <div className="legal container">
        <p>Copyright <span className='blue'>&copy;<span id="currentYear"></span></span>. All rights reserved.</p>
        <span className='copyRight'>Made with <span className="heartbeat"><FavoriteIcon color="warning" sx={{ fontSize: 18 }} /></span> by <span className='blue'>Dinh Luong Ta</span></span>
      </div>
    </footer>
  );
};