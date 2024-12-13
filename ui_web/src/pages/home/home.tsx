import * as React from "react";
import "./home.scss"; // Tạo file SCSS để style

export const Home: React.FC = () => {
  const teamMembers = [
    "Nguyễn Đức Dương - 20210259",
    "Nguyễn Thanh Hải - 20210311",
    "Trần Xuân Quyến - 20214068",
    "Cồ Huy Dũng - 20213834",
    "Trần Đình An - 20213791",
  ];

  return (
    <div className="home-container">
      {/* Tiêu đề */}
      <h1 className="home-title" >
        Chào mừng bạn đến với Ứng dụng Chat Nhóm
      </h1>
      <p className="home-subtitle">
        Bài tập lớn chủ đề 12: Lập trình SOCKET ứng dụng chat. <br />
        Hỗ trợ chat nhóm, đăng ký và quản lý tài khoản.
      </p>

      {/* Thẻ bài - tính năng */}
      <div className="features-section">
        <div className="feature-card">
          <h3>💬 Chat Nhóm</h3>
          <p>
            Tạo các nhóm chat dễ dàng. Gửi tin nhắn và chia sẻ ý
            tưởng cùng bạn bè.
          </p>
        </div>
        <div className="feature-card">
          <h3>🧑‍💻 Quản lý tài khoản</h3>
          <p>
            Đăng ký, đăng nhập và quản lý thông tin tài khoản của bạn an toàn và
            dễ dàng.
          </p>
        </div>
      </div>

      {/* Danh sách thành viên nhóm */}
      <div className="team-section">
        <h2 className="team-title">Thành viên nhóm</h2>
        <ul className="team-list">
          {teamMembers.map((member, index) => (
            <li key={index} className="team-member">
              {member}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
