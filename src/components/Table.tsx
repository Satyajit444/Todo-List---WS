const productData = [
  {
    name: "Apple Watch Series 7",
    category: "Electronics",
    price: 296,
    sold: 22,
    profit: 45,
  },
  {
    name: "Macbook Pro M1",
    category: "Electronics",
    price: 546,
    sold: 12,
    profit: 125,
  },
  {
    name: "Dell Inspiron 15",
    category: "Electronics",
    price: 443,
    sold: 64,
    profit: 247,
  },
  {
    name: "HP Probook 450",
    category: "Electronics",
    price: 499,
    sold: 72,
    profit: 103,
  },
];

const Table = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white  dark:border-strokedark dark:bg-boxdark">
      <div className="py-4 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-lg font-semibold text-black dark:text-white">
          Product List
        </h4>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-6 border-b border-stroke py-3 px-4 bg-gray-200 dark:bg-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-3">
          <p className="font-medium text-sm text-black dark:text-white">
            Product Name
          </p>
        </div>
        <div className="col-span-2 hidden sm:block">
          <p className="font-medium text-sm text-black dark:text-white">
            Category
          </p>
        </div>
        <div className="col-span-1">
          <p className="font-medium text-sm text-black dark:text-white">
            Price
          </p>
        </div>
      </div>

      {/* Table Rows */}
      {productData.map((product, key) => (
        <div
          className="grid grid-cols-6 border-b border-stroke py-2 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
          key={key}
        >
          <div className="col-span-3 flex items-center gap-4">
            <p className="text-sm text-black dark:text-white">{product.name}</p>
          </div>
          <div className="col-span-2 hidden sm:flex items-center">
            <p className="text-sm text-black dark:text-white">
              {product.category}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">
              ${product.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Table;
