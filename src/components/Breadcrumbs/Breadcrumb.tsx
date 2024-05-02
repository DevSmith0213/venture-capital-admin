interface BreadcrumbProps {
  isVC?: boolean;
  isBlog?: boolean;
  pageName: string;
}
const Breadcrumb = ({ isVC = false, isBlog = false, pageName }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <nav>
        <ol className="flex items-center gap-2">
          {/* <li>
            <Link className="font-medium" href="/">
              Dashboard /
            </Link>
          </li> */}
          {isVC &&
            <li className="font-medium">
              <a className="font-medium" href="/venturecapital/vc">
                Venture Capitals /
              </a>
            </li>
          }
          {isBlog &&
            <li className="font-medium">
              <a className="font-medium" href="/blog">
                Blog /
              </a>
            </li>
          }
          <li className="font-bold text-[#1c2434] uppercase">
            <a className="font-bold" href={pageName}>
              {pageName}
            </a>
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
