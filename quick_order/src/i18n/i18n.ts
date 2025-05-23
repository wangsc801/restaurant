import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          common: {
            back: 'Back',
            confirm: 'Confirm',
            cancel: 'Cancel',
            No: 'No.',
            price: 'Price',
            quantity: 'Quantity',
            subtotal: 'Subtotal',
            total: 'Total',
            loading: 'Loading...',
            backToMain: 'Back to Main',
            item: 'item',
            print: 'print',
            printMessage: 'print message'
          },
          login: {
            title: 'Restaurant Login',
            selectBranch: 'Select a Branch',
            changeBranch: 'Change Branch',
            employeeName: 'Employee Name',
            password: 'Password',
            login: 'Login',
            enterName: 'Enter your name',
            enterPassword: 'Enter your password',
          },
          home: {
            order: "Menu",
            orderManagement: "Order Management",
            addItem: "Add Item",
            transactionRecord: "Transaction Record",
          },
          menu: {
            allItems: 'All Items',
            order: 'Order',
            addToCart: 'Add',
            remarks: 'Remarks',
            customizeItem: "Customize Item",
            refresh: "Refresh",
            checkout: 'Checkout',
            checkoutList: "Checkout List",
            orderSummary: "Order Summary",
            search: 'Search',
            searchPlaceholder: 'Search for item name or abbreviation...',
          },
          menuRemark: {
            remarks: "Remarks",
            spiciness: "Spiciness",
            spicinessNone: "None",
            spicinessMild: "Mild",
            spicinessMedium: "Medium",
            spicinessHot: "Hot",
            seasoning: "Seasoning",
            seasoningLessSalt: "Less Salt",
            seasoningMoreSalt: "More Salt",
            seasoningNoPepper: "No Pepper",
            seasoningLessPepper: "Less Pepper",
            seasoningMorePepper: "More Pepper",
            seasoningLessSugar: "Less Sugar",
            seasoningMoreSugar: "More Sugar",
            seasoningLessSoySource: "Less Soy Sauce",
            seasoningMoreSoySource: "More Soy Sauce",
            ingredients: "Ingredients",
            ingredientsNoCoriander: "No Coriander",
            customRemark: "Other Requirements",
            customRemarkPlaceholder: "Enter any special requirements...",
          },
          checkout: {
            orderSummary: 'Order Summary',
            totalPrice: 'Total Price',
            orderTotalPrice: 'Order Total Price',
            paymentMethod: 'Payment Method',
            cash: 'Cash Payment',
            pending: 'Pay Later',
            mobile: 'Mobile Payment',
            points: 'Points Payment',
            other: 'Other Methods',
            selectPaymentMethod: 'Select a payment method',
            printerError: "Receipt Printer Error",
            printReceipt: "Print a Receipt"
          },
          addItem: {
            title: 'Add Item',
            name: 'Item Name',
            subtitle: 'Subtitle',
            price: 'Price',
            unit: 'Unit',
            categories: 'Categories',
            tags: 'Tags',
            description: 'Description',
            imageUrl: 'Image URL',
            customCategoryPlaceholder: 'Press Enter to add custom category',
            customTagPlaceholder: 'Press Enter to add custom tag',
            selectImage: 'Click to select image',
            image: 'Item Image',
          },
          statistic: {
            previousDay: "previous day",
            nextDay: "next day",
          }
        }
      },
      zh: {
        translation: {
          common: {
            back: '返回',
            confirm: '确认',
            cancel: '取消',
            No: '序号',
            price: '价格',
            quantity: '数量',
            subtotal: '小计',
            total: '合计',
            loading: '加载中...',
            backToMain: '返回主页',
            item: '项目',
            remark: '备注',
            print: '打印',
            printMessage: '打印消息'
          },
          login: {
            title: '餐厅登录',
            selectBranch: '选择门店',
            changeBranch: '更换门店',
            employeeName: '员工姓名',
            password: '密码',
            login: '登录',
            enterName: '请输入姓名',
            enterPassword: '请输入密码',
          },
          home: {
            order: "菜单",
            orderManagement: "订单管理",
            addItem: "添加商品",
            transactionRecord: "交易记录",
            today: "今日情况"
          },
          menu: {
            allItems: '所有餐品',
            order: '点餐',
            addToCart: '添加',
            remarks: '备注',
            customizeItem: "自定义",
            refresh: "刷新",
            checkout: '结账',
            checkoutList: "结账单",
            orderSummary: "订单摘要",
            search: '搜索',
            searchPlaceholder: '搜索菜品名称或缩写...',
          },
          menuRemark: {
            remarks: "备注",
            spiciness: "辣度",
            spicinessNone: "不加辣",
            spicinessMild: "微辣",
            spicinessMedium: "中辣",
            spicinessHot: "重辣",
            seasoning: "调料",
            seasoningLessSalt: "少盐",
            seasoningMoreSalt: "多盐",
            seasoningNoPepper: "不放胡椒",
            seasoningLessPepper: "少胡椒",
            seasoningMorePepper: "多胡椒",
            seasoningLessSugar: "少糖",
            seasoningMoreSugar: "多糖",
            seasoningLessSoySource: "少酱油",
            seasoningMoreSoySource: "多酱油",
            ingredients: "食材",
            ingredientsNoCoriander: "不加香菜",
            customRemark: "其他要求",
            customRemarkPlaceholder: "请输入其他特殊要求...",
          },
          checkout: {
            orderSummary: '订单摘要',
            totalPrice: '总金额',
            orderTotalPrice: '订单总金额',
            paymentMethod: '支付方式',
            cash: '现金支付',
            pending: '先吃后付',
            mobile: '移动支付',
            points: '积分支付',
            other: '其他方式',
            selectPaymentMethod: '请选择支付方式',
            printerError: "小票打印机出错",
            printReceipt: "打印小票"
          },
          addItem: {
            title: '添加商品',
            name: '商品名称',
            subtitle: '副标题',
            price: '价格',
            unit: '单位',
            categories: '分类',
            tags: '标签',
            description: '描述',
            imageUrl: '图片链接',
            customCategoryPlaceholder: 'Press Enter to add custom category',
            customTagPlaceholder: 'Press Enter to add custom tag',
            selectImage: 'Click to select image',
            image: 'Item Image',
          },
          statistic: {
            previousDay: "前一天",
            nextDay: "后一天",
          }
        }
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n; 