/**
 * 中国象棋界面渲染模块（响应式版本）
 * 支持各种屏幕尺寸和分辨率
 */

const ChessUI = (function() {
    'use strict';

    const BASE_QI_PAN_KUANG_DU = 540;
    const BASE_QI_PAN_GAO_DU = 600;
    const BASE_WANG_GE = 60;
    const BASE_BIAN_JU = 30;
    const BASE_QI_ZI_BAN_JING = 26;

    let huaBu = null;
    let huaBuShangXiaWen = null;
    let suoFangBiLi = 1;
    let dangQianChiCun = {
        qiPanKuanDu: BASE_QI_PAN_KUANG_DU,
        qiPanGaoDu: BASE_QI_PAN_GAO_DU,
        wangGe: BASE_WANG_GE,
        bianJu: BASE_BIAN_JU,
        qiZiBanJing: BASE_QI_ZI_BAN_JING
    };

    const HONG_FANG_YAN_SE = '#C41E3A';
    const HEI_FANG_YAN_SE = '#1a1a1a';
    const QI_PAN_BEI_JING = '#DEB887';
    const XIAN_TIAO_YAN_SE = '#4a3728';

    /**
     * 初始化画布
     */
    function chuShiHuaHuaBu(canvasId) {
        huaBu = document.getElementById(canvasId);
        if (!huaBu) {
            console.error('找不到画布元素:', canvasId);
            return false;
        }

        huaBuShangXiaWen = huaBu.getContext('2d');
        jiSuanZuiJiaChiCun();

        return true;
    }

    /**
     * 计算最佳尺寸
     */
    function jiSuanZuiJiaChiCun() {
        const rongQi = huaBu.parentElement;
        const keYongKuanDu = rongQi.clientWidth - 16;
        const keYongGaoDu = rongQi.clientHeight - 16;

        const qiPanKuanGaoBi = BASE_QI_PAN_KUANG_DU / BASE_QI_PAN_GAO_DU;
        const keYongKuanGaoBi = keYongKuanDu / keYongGaoDu;

        let muBiaoKuanDu, muBiaoGaoDu;

        if (keYongKuanGaoBi > qiPanKuanGaoBi) {
            muBiaoGaoDu = keYongGaoDu;
            muBiaoKuanDu = muBiaoGaoDu * qiPanKuanGaoBi;
        } else {
            muBiaoKuanDu = keYongKuanDu;
            muBiaoGaoDu = muBiaoKuanDu / qiPanKuanGaoBi;
        }

        suoFangBiLi = muBiaoKuanDu / BASE_QI_PAN_KUANG_DU;
        suoFangBiLi = Math.min(suoFangBiLi, 1.5);

        dangQianChiCun = {
            qiPanKuanDu: Math.floor(BASE_QI_PAN_KUANG_DU * suoFangBiLi),
            qiPanGaoDu: Math.floor(BASE_QI_PAN_GAO_DU * suoFangBiLi),
            wangGe: Math.floor(BASE_WANG_GE * suoFangBiLi),
            bianJu: Math.floor(BASE_BIAN_JU * suoFangBiLi),
            qiZiBanJing: Math.floor(BASE_QI_ZI_BAN_JING * suoFangBiLi)
        };

        huaBu.width = dangQianChiCun.qiPanKuanDu;
        huaBu.height = dangQianChiCun.qiPanGaoDu;
        huaBu.style.width = dangQianChiCun.qiPanKuanDu + 'px';
        huaBu.style.height = dangQianChiCun.qiPanGaoDu + 'px';

        console.log('屏幕适配:', {
            缩放比例: suoFangBiLi.toFixed(2),
            棋盘尺寸: `${dangQianChiCun.qiPanKuanDu}x${dangQianChiCun.qiPanGaoDu}`
        });
    }

    /**
     * 获取当前尺寸
     */
    function huoQuDangQianChiCun() {
        return dangQianChiCun;
    }

    /**
     * 绘制棋盘
     */
    function huiZhiQiPan() {
        const { qiPanKuanDu, qiPanGaoDu, wangGe, bianJu } = dangQianChiCun;

        huaBuShangXiaWen.fillStyle = QI_PAN_BEI_JING;
        huaBuShangXiaWen.fillRect(0, 0, qiPanKuanDu, qiPanGaoDu);

        huaBuShangXiaWen.strokeStyle = XIAN_TIAO_YAN_SE;
        huaBuShangXiaWen.lineWidth = Math.max(1, suoFangBiLi);

        for (let hang = 0; hang < 10; hang++) {
            const y = bianJu + hang * wangGe;
            huaBuShangXiaWen.beginPath();
            huaBuShangXiaWen.moveTo(bianJu, y);
            huaBuShangXiaWen.lineTo(bianJu + 8 * wangGe, y);
            huaBuShangXiaWen.stroke();
        }

        for (let lie = 0; lie < 9; lie++) {
            const x = bianJu + lie * wangGe;
            
            huaBuShangXiaWen.beginPath();
            huaBuShangXiaWen.moveTo(x, bianJu);
            huaBuShangXiaWen.lineTo(x, bianJu + 4 * wangGe);
            huaBuShangXiaWen.stroke();

            huaBuShangXiaWen.beginPath();
            huaBuShangXiaWen.moveTo(x, bianJu + 5 * wangGe);
            huaBuShangXiaWen.lineTo(x, bianJu + 9 * wangGe);
            huaBuShangXiaWen.stroke();
        }

        huaBuShangXiaWen.beginPath();
        huaBuShangXiaWen.moveTo(bianJu, bianJu + 4 * wangGe);
        huaBuShangXiaWen.lineTo(bianJu + 8 * wangGe, bianJu + 4 * wangGe);
        huaBuShangXiaWen.stroke();

        huaBuShangXiaWen.beginPath();
        huaBuShangXiaWen.moveTo(bianJu, bianJu + 5 * wangGe);
        huaBuShangXiaWen.lineTo(bianJu + 8 * wangGe, bianJu + 5 * wangGe);
        huaBuShangXiaWen.stroke();

        huiZhiJiuGongGe(3, 0);
        huiZhiJiuGongGe(3, 7);

        huiZhiHeJie();

        huiZhiPaoBingWeiZhi();
    }

    /**
     * 绘制九宫格斜线
     */
    function huiZhiJiuGongGe(qiShiLie, qiShiHang) {
        const { wangGe, bianJu } = dangQianChiCun;

        huaBuShangXiaWen.beginPath();
        huaBuShangXiaWen.moveTo(
            bianJu + qiShiLie * wangGe,
            bianJu + qiShiHang * wangGe
        );
        huaBuShangXiaWen.lineTo(
            bianJu + (qiShiLie + 2) * wangGe,
            bianJu + (qiShiHang + 2) * wangGe
        );
        huaBuShangXiaWen.stroke();

        huaBuShangXiaWen.beginPath();
        huaBuShangXiaWen.moveTo(
            bianJu + (qiShiLie + 2) * wangGe,
            bianJu + qiShiHang * wangGe
        );
        huaBuShangXiaWen.lineTo(
            bianJu + qiShiLie * wangGe,
            bianJu + (qiShiHang + 2) * wangGe
        );
        huaBuShangXiaWen.stroke();
    }

    /**
     * 绘制河界文字
     */
    function huiZhiHeJie() {
        const { wangGe, bianJu } = dangQianChiCun;
        const ziTiDaXiao = Math.max(16, Math.floor(24 * suoFangBiLi));

        huaBuShangXiaWen.font = `bold ${ziTiDaXiao}px KaiTi, 楷体, STKaiti, serif`;
        huaBuShangXiaWen.fillStyle = XIAN_TIAO_YAN_SE;
        huaBuShangXiaWen.textAlign = 'center';
        huaBuShangXiaWen.textBaseline = 'middle';

        const heJieY = bianJu + 4.5 * wangGe;
        
        huaBuShangXiaWen.fillText('楚', bianJu + 1 * wangGe, heJieY);
        huaBuShangXiaWen.fillText('河', bianJu + 2 * wangGe, heJieY);
        
        huaBuShangXiaWen.fillText('漢', bianJu + 6 * wangGe, heJieY);
        huaBuShangXiaWen.fillText('界', bianJu + 7 * wangGe, heJieY);
    }

    /**
     * 绘制炮和兵的标记位置
     */
    function huiZhiPaoBingWeiZhi() {
        const weiZhiLieBiao = [
            { hang: 2, lie: 1 }, { hang: 2, lie: 7 },
            { hang: 7, lie: 1 }, { hang: 7, lie: 7 },
            { hang: 3, lie: 0 }, { hang: 3, lie: 2 }, { hang: 3, lie: 4 },
            { hang: 3, lie: 6 }, { hang: 3, lie: 8 },
            { hang: 6, lie: 0 }, { hang: 6, lie: 2 }, { hang: 6, lie: 4 },
            { hang: 6, lie: 6 }, { hang: 6, lie: 8 }
        ];

        weiZhiLieBiao.forEach(weiZhi => {
            huiZhiWeiZhiBiaoJi(weiZhi.hang, weiZhi.lie);
        });
    }

    /**
     * 绘制位置标记
     */
    function huiZhiWeiZhiBiaoJi(hang, lie) {
        const { wangGe, bianJu } = dangQianChiCun;
        const x = bianJu + lie * wangGe;
        const y = bianJu + hang * wangGe;
        const changDu = Math.max(4, Math.floor(6 * suoFangBiLi));
        const jianJu = Math.max(2, Math.floor(3 * suoFangBiLi));

        huaBuShangXiaWen.strokeStyle = XIAN_TIAO_YAN_SE;
        huaBuShangXiaWen.lineWidth = Math.max(0.5, suoFangBiLi * 0.5);

        if (lie > 0) {
            huaBuShangXiaWen.beginPath();
            huaBuShangXiaWen.moveTo(x - jianJu, y - jianJu - changDu);
            huaBuShangXiaWen.lineTo(x - jianJu, y - jianJu);
            huaBuShangXiaWen.lineTo(x - jianJu - changDu, y - jianJu);
            huaBuShangXiaWen.stroke();

            huaBuShangXiaWen.beginPath();
            huaBuShangXiaWen.moveTo(x - jianJu, y + jianJu + changDu);
            huaBuShangXiaWen.lineTo(x - jianJu, y + jianJu);
            huaBuShangXiaWen.lineTo(x - jianJu - changDu, y + jianJu);
            huaBuShangXiaWen.stroke();
        }

        if (lie < 8) {
            huaBuShangXiaWen.beginPath();
            huaBuShangXiaWen.moveTo(x + jianJu, y - jianJu - changDu);
            huaBuShangXiaWen.lineTo(x + jianJu, y - jianJu);
            huaBuShangXiaWen.lineTo(x + jianJu + changDu, y - jianJu);
            huaBuShangXiaWen.stroke();

            huaBuShangXiaWen.beginPath();
            huaBuShangXiaWen.moveTo(x + jianJu, y + jianJu + changDu);
            huaBuShangXiaWen.lineTo(x + jianJu, y + jianJu);
            huaBuShangXiaWen.lineTo(x + jianJu + changDu, y + jianJu);
            huaBuShangXiaWen.stroke();
        }
    }

    /**
     * 绘制棋子
     */
    function huiZhiQiZi(hang, lie, qiZi, beiXuanZhong) {
        const { wangGe, bianJu, qiZiBanJing } = dangQianChiCun;
        const x = bianJu + lie * wangGe;
        const y = bianJu + hang * wangGe;
        const banJing = qiZiBanJing;
        const ziTiDaXiao = Math.max(16, Math.floor(28 * suoFangBiLi));

        huaBuShangXiaWen.beginPath();
        huaBuShangXiaWen.arc(x, y, banJing + 2, 0, Math.PI * 2);
        huaBuShangXiaWen.fillStyle = '#8B4513';
        huaBuShangXiaWen.fill();

        const jianBian = huaBuShangXiaWen.createRadialGradient(
            x - 5 * suoFangBiLi, y - 5 * suoFangBiLi, 0, x, y, banJing
        );
        
        if (qiZi.fang === ChessRules.HONG_FANG) {
            jianBian.addColorStop(0, '#FFD700');
            jianBian.addColorStop(0.3, '#F5DEB3');
            jianBian.addColorStop(1, '#DEB887');
        } else {
            jianBian.addColorStop(0, '#4CAF50');
            jianBian.addColorStop(0.3, '#2E7D32');
            jianBian.addColorStop(1, '#1B5E20');
        }

        huaBuShangXiaWen.beginPath();
        huaBuShangXiaWen.arc(x, y, banJing, 0, Math.PI * 2);
        huaBuShangXiaWen.fillStyle = jianBian;
        huaBuShangXiaWen.fill();

        huaBuShangXiaWen.beginPath();
        huaBuShangXiaWen.arc(x, y, banJing - 3 * suoFangBiLi, 0, Math.PI * 2);
        huaBuShangXiaWen.strokeStyle = qiZi.fang === ChessRules.HONG_FANG ? HONG_FANG_YAN_SE : '#FFEB3B';
        huaBuShangXiaWen.lineWidth = Math.max(1, 2 * suoFangBiLi);
        huaBuShangXiaWen.stroke();

        const mingCheng = ChessRules.huoQuQiZiMingCheng(qiZi);
        huaBuShangXiaWen.font = `bold ${ziTiDaXiao}px KaiTi, 楷体, STKaiti, serif`;
        huaBuShangXiaWen.fillStyle = qiZi.fang === ChessRules.HONG_FANG ? HONG_FANG_YAN_SE : '#FFEB3B';
        huaBuShangXiaWen.textAlign = 'center';
        huaBuShangXiaWen.textBaseline = 'middle';
        huaBuShangXiaWen.fillText(mingCheng, x, y);

        if (beiXuanZhong) {
            huaBuShangXiaWen.beginPath();
            huaBuShangXiaWen.arc(x, y, banJing + 4 * suoFangBiLi, 0, Math.PI * 2);
            huaBuShangXiaWen.strokeStyle = '#FFD700';
            huaBuShangXiaWen.lineWidth = Math.max(2, 3 * suoFangBiLi);
            huaBuShangXiaWen.stroke();
        }
    }

    /**
     * 绘制所有棋子
     */
    function huiZhiSuoYouQiZi(qiPan, xuanZhongWeiZhi) {
        for (let hang = 0; hang < 10; hang++) {
            for (let lie = 0; lie < 9; lie++) {
                const qiZi = qiPan[hang][lie];
                if (qiZi) {
                    const beiXuanZhong = xuanZhongWeiZhi && 
                                         xuanZhongWeiZhi.hang === hang && 
                                         xuanZhongWeiZhi.lie === lie;
                    huiZhiQiZi(hang, lie, qiZi, beiXuanZhong);
                }
            }
        }
    }

    /**
     * 绘制高亮位置（可移动位置）
     */
    function huiZhiGaoLiangWeiZhi(keDongWeiZhi) {
        const { wangGe, bianJu } = dangQianChiCun;
        const yuanBanJing = Math.max(8, Math.floor(12 * suoFangBiLi));

        keDongWeiZhi.forEach(weiZhi => {
            const x = bianJu + weiZhi.lie * wangGe;
            const y = bianJu + weiZhi.hang * wangGe;

            huaBuShangXiaWen.beginPath();
            huaBuShangXiaWen.arc(x, y, yuanBanJing, 0, Math.PI * 2);
            huaBuShangXiaWen.fillStyle = 'rgba(0, 255, 0, 0.5)';
            huaBuShangXiaWen.fill();
        });
    }

    /**
     * 绘制将军提示
     */
    function huiZhiJiangJunTiShi(hang, lie) {
        const { wangGe, bianJu, qiZiBanJing } = dangQianChiCun;
        const x = bianJu + lie * wangGe;
        const y = bianJu + hang * wangGe;

        huaBuShangXiaWen.beginPath();
        huaBuShangXiaWen.arc(x, y, qiZiBanJing + 5 * suoFangBiLi, 0, Math.PI * 2);
        huaBuShangXiaWen.strokeStyle = '#FF0000';
        huaBuShangXiaWen.lineWidth = Math.max(2, 3 * suoFangBiLi);
        huaBuShangXiaWen.setLineDash([5 * suoFangBiLi, 5 * suoFangBiLi]);
        huaBuShangXiaWen.stroke();
        huaBuShangXiaWen.setLineDash([]);
    }

    /**
     * 完整重绘棋盘
     */
    function chongHuiQiPan(qiPan, xuanZhongWeiZhi, keDongWeiZhi, jiangJunWeiZhi) {
        huiZhiQiPan();
        
        if (keDongWeiZhi && keDongWeiZhi.length > 0) {
            huiZhiGaoLiangWeiZhi(keDongWeiZhi);
        }
        
        huiZhiSuoYouQiZi(qiPan, xuanZhongWeiZhi);
        
        if (jiangJunWeiZhi) {
            huiZhiJiangJunTiShi(jiangJunWeiZhi.hang, jiangJunWeiZhi.lie);
        }
    }

    /**
     * 将屏幕坐标转换为棋盘坐标
     */
    function zhuanHuanWeiQiPanZuoBiao(clientX, clientY) {
        const { wangGe, bianJu } = dangQianChiCun;
        const juXing = huaBu.getBoundingClientRect();
        const x = clientX - juXing.left;
        const y = clientY - juXing.top;

        const lie = Math.round((x - bianJu) / wangGe);
        const hang = Math.round((y - bianJu) / wangGe);

        if (hang >= 0 && hang <= 9 && lie >= 0 && lie <= 8) {
            return { hang, lie };
        }
        return null;
    }

    /**
     * 添加点击事件监听
     */
    function tianJiaDianJiJianTing(huiDiaoHanShu) {
        const chuLiShiJian = (shiJian) => {
            shiJian.preventDefault();
            
            let clientX, clientY;
            
            if (shiJian.touches && shiJian.touches.length > 0) {
                clientX = shiJian.touches[0].clientX;
                clientY = shiJian.touches[0].clientY;
            } else {
                clientX = shiJian.clientX;
                clientY = shiJian.clientY;
            }

            const weiZhi = zhuanHuanWeiQiPanZuoBiao(clientX, clientY);
            if (weiZhi) {
                huiDiaoHanShu(weiZhi.hang, weiZhi.lie);
            }
        };

        huaBu.addEventListener('click', chuLiShiJian);
        huaBu.addEventListener('touchstart', chuLiShiJian, { passive: false });
    }

    return {
        chuShiHuaHuaBu,
        huiZhiQiPan,
        huiZhiSuoYouQiZi,
        huiZhiGaoLiangWeiZhi,
        huiZhiJiangJunTiShi,
        chongHuiQiPan,
        zhuanHuanWeiQiPanZuoBiao,
        tianJiaDianJiJianTing,
        huoQuDangQianChiCun,
        jiSuanZuiJiaChiCun
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChessUI;
}
