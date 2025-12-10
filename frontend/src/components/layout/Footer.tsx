const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Về AuctionHub</h3>
            <p className="text-sm text-muted-foreground">
              Sàn đấu giá trực tuyến uy tín, kết nối người mua và người bán trên
              toàn quốc.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Hướng dẫn đấu giá
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Liên kết</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  Danh mục sản phẩm
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Đấu giá hot
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Trở thành người bán
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Liên hệ</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: support@auctionhub.vn</li>
              <li>Hotline: 1900 xxxx</li>
              <li>Địa chỉ: Tp. Hồ Chí Minh</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2025 AuctionHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
