/**
 * 中国象棋主程序模块
 * 负责游戏逻辑控制、事件处理、状态管理等
 */

(function() {
    'use strict';

    let youXiZhuangTai = {
        qiPan: null,
        dangQianFang: ChessRules.HONG_FANG,
        buShu: 0,
        xuanZhongWeiZhi: null,
        keDongWeiZhi: [],
        liShiBuZhou: [],
        yinXiaoKaiQi: true,
        youXiJieShu: false,
        youXiMoShi: 'pvp',
        aiNanDu: 2,
        aiSiKaoZhong: false
    };

    const YinXiaoGuanLi = (function() {
        let yinXiaoHuanChong = {};
        
        const yinXiaoMingCheng = {
            zouZi: 'move',
            chiZi: 'capture',
            jiangJun: 'check',
            shengLi: 'victory'
        };

        function chuShiHua() {
            Object.keys(yinXiaoMingCheng).forEach(key => {
                yinXiaoHuanChong[key] = null;
            });
        }

        function boFang(yinXiaoLeiXing) {
            if (!youXiZhuangTai.yinXiaoKaiQi) return;
            console.log(`播放音效: ${yinXiaoLeiXing}`);
        }

        function qieHuanKaiGuan() {
            youXiZhuangTai.yinXiaoKaiQi = !youXiZhuangTai.yinXiaoKaiQi;
            return youXiZhuangTai.yinXiaoKaiQi;
        }

        function huoQuZhuangTai() {
            return youXiZhuangTai.yinXiaoKaiQi;
        }

        return {
            chuShiHua,
            boFang,
            qieHuanKaiGuan,
            huoQuZhuangTai
        };
    })();

    /**
     * 初始化游戏
     */
    function chuShiHuaYouXi() {
        Storage.chuShiHua();
        YinXiaoGuanLi.chuShiHua();
        
        if (!ChessUI.chuShiHuaHuaBu('chess-board')) {
            console.error('画布初始化失败');
            return;
        }

        chongZhiYouXi();
        
        ChessUI.tianJiaDianJiJianTing(chuLiDianJiShiJian);
        bangDingKongZhiAnNiu();
        bangDingChuangKouShiJian();
        
        jiaZaiBaoCunDeYouXi();
    }

    /**
     * 重置游戏
     */
    function chongZhiYouXi() {
        youXiZhuangTai = {
            qiPan: ChessRules.chuangJianChuShiQiPan(),
            dangQianFang: ChessRules.HONG_FANG,
            buShu: 0,
            xuanZhongWeiZhi: null,
            keDongWeiZhi: [],
            liShiBuZhou: [],
            yinXiaoKaiQi: youXiZhuangTai.yinXiaoKaiQi || true,
            youXiJieShu: false,
            youXiMoShi: youXiZhuangTai.youXiMoShi || 'pvp',
            aiNanDu: youXiZhuangTai.aiNanDu || 2,
            aiSiKaoZhong: false
        };

        ChessAI.sheZhiNanDu(youXiZhuangTai.aiNanDu);
        gengXinJieMian();
        gengXinMoShiAnNiu();
    }

    /**
     * 处理点击事件
     */
    function chuLiDianJiShiJian(hang, lie) {
        if (youXiZhuangTai.youXiJieShu || youXiZhuangTai.aiSiKaoZhong) return;

        if (youXiZhuangTai.youXiMoShi === 'pve' && youXiZhuangTai.dangQianFang === ChessRules.HEI_FANG) {
            return;
        }

        const dianJiWeiZhi = { hang, lie };
        const dianJiQiZi = youXiZhuangTai.qiPan[hang][lie];

        if (youXiZhuangTai.xuanZhongWeiZhi) {
            const shiFouHeFaYiDong = youXiZhuangTai.keDongWeiZhi.some(
                weiZhi => weiZhi.hang === hang && weiZhi.lie === lie
            );

            if (shiFouHeFaYiDong) {
                zhiXingZouZi(youXiZhuangTai.xuanZhongWeiZhi, dianJiWeiZhi);
            } else if (dianJiQiZi && dianJiQiZi.fang === youXiZhuangTai.dangQianFang) {
                xuanZeQiZi(hang, lie);
            } else {
                quXiaoXuanZe();
            }
        } else if (dianJiQiZi && dianJiQiZi.fang === youXiZhuangTai.dangQianFang) {
            xuanZeQiZi(hang, lie);
        }
    }

    /**
     * 选择棋子
     */
    function xuanZeQiZi(hang, lie) {
        youXiZhuangTai.xuanZhongWeiZhi = { hang, lie };
        youXiZhuangTai.keDongWeiZhi = ChessRules.huoQuHeFaYiDongWeiZhi(
            youXiZhuangTai.qiPan, hang, lie
        );

        gengXinJieMian();
    }

    /**
     * 取消选择
     */
    function quXiaoXuanZe() {
        youXiZhuangTai.xuanZhongWeiZhi = null;
        youXiZhuangTai.keDongWeiZhi = [];
        gengXinJieMian();
    }

    /**
     * 执行走子
     */
    function zhiXingZouZi(qiShiWeiZhi, muBiaoWeiZhi) {
        const qiHang = qiShiWeiZhi.hang;
        const qiLie = qiShiWeiZhi.lie;
        const muBiaoHang = muBiaoWeiZhi.hang;
        const muBiaoLie = muBiaoWeiZhi.lie;

        const beiChiQiZi = ChessRules.zhiXingYiDong(
            youXiZhuangTai.qiPan, qiHang, qiLie, muBiaoHang, muBiaoLie
        );

        const buZhou = {
            qiHang, qiLie, muBiaoHang, muBiaoLie,
            qiZi: youXiZhuangTai.qiPan[muBiaoHang][muBiaoLie],
            beiChiQiZi,
            fang: youXiZhuangTai.dangQianFang
        };
        youXiZhuangTai.liShiBuZhou.push(buZhou);

        youXiZhuangTai.buShu++;
        youXiZhuangTai.dangQianFang = youXiZhuangTai.dangQianFang === ChessRules.HONG_FANG 
            ? ChessRules.HEI_FANG : ChessRules.HONG_FANG;

        youXiZhuangTai.xuanZhongWeiZhi = null;
        youXiZhuangTai.keDongWeiZhi = [];

        if (beiChiQiZi) {
            YinXiaoGuanLi.boFang('chiZi');
            
            if (beiChiQiZi.leiXing === ChessRules.QI_ZI_LEI_XING.JIANG_SHUAI) {
                youXiZhuangTai.youXiJieShu = true;
                const shengLiFang = buZhou.fang === ChessRules.HONG_FANG ? '红方' : '黑方';
                YinXiaoGuanLi.boFang('shengLi');
                xianShiMoTaiChuang('游戏结束', `${shengLiFang}获胜！`);
            }
        } else {
            YinXiaoGuanLi.boFang('zouZi');
        }

        if (!youXiZhuangTai.youXiJieShu) {
            const beiJiangJun = ChessRules.jianChaShiFouBeiJiangJun(
                youXiZhuangTai.qiPan, youXiZhuangTai.dangQianFang
            );
            
            if (beiJiangJun) {
                YinXiaoGuanLi.boFang('jiangJun');
                
                const beiJiangSi = ChessRules.jianChaShiFouBeiJiangSi(
                    youXiZhuangTai.qiPan, youXiZhuangTai.dangQianFang
                );
                
                if (beiJiangSi) {
                    youXiZhuangTai.youXiJieShu = true;
                    const shengLiFang = youXiZhuangTai.dangQianFang === ChessRules.HONG_FANG 
                        ? '黑方' : '红方';
                    YinXiaoGuanLi.boFang('shengLi');
                    xianShiMoTaiChuang('游戏结束', `${shengLiFang}获胜！`);
                }
            }
        }

        gengXinJieMian();

        if (!youXiZhuangTai.youXiJieShu && 
            youXiZhuangTai.youXiMoShi === 'pve' && 
            youXiZhuangTai.dangQianFang === ChessRules.HEI_FANG) {
            setTimeout(aiZouZi, 500);
        }
    }

    /**
     * AI走子
     */
    function aiZouZi() {
        console.log('aiZouZi被调用, 游戏结束?', youXiZhuangTai.youXiJieShu);
        if (youXiZhuangTai.youXiJieShu) return;

        youXiZhuangTai.aiSiKaoZhong = true;
        gengXinYouXiXinXi();

        setTimeout(() => {
            console.log('开始获取AI走法...');
            const zuiJiaZouFa = ChessAI.huoQuZuiJiaZouFa(youXiZhuangTai.qiPan, ChessRules.HEI_FANG);
            console.log('AI走法:', zuiJiaZouFa);
            
            youXiZhuangTai.aiSiKaoZhong = false;

            if (zuiJiaZouFa) {
                console.log('执行AI走子...');
                zhiXingZouZi(
                    { hang: zuiJiaZouFa.qiHang, lie: zuiJiaZouFa.qiLie },
                    { hang: zuiJiaZouFa.muBiaoHang, lie: zuiJiaZouFa.muBiaoLie }
                );
            } else {
                youXiZhuangTai.youXiJieShu = true;
                xianShiMoTaiChuang('游戏结束', '红方获胜！');
            }
        }, 100);
    }

    /**
     * 执行悔棋
     */
    function zhiXingHuiQi() {
        if (youXiZhuangTai.liShiBuZhou.length === 0 || youXiZhuangTai.youXiJieShu) {
            return;
        }

        const zuiHouBuZhou = youXiZhuangTai.liShiBuZhou.pop();
        
        ChessRules.cheXiaoYiDong(
            youXiZhuangTai.qiPan,
            zuiHouBuZhou.qiHang,
            zuiHouBuZhou.qiLie,
            zuiHouBuZhou.muBiaoHang,
            zuiHouBuZhou.muBiaoLie,
            zuiHouBuZhou.beiChiQiZi
        );

        youXiZhuangTai.dangQianFang = zuiHouBuZhou.fang;
        youXiZhuangTai.buShu--;
        youXiZhuangTai.xuanZhongWeiZhi = null;
        youXiZhuangTai.keDongWeiZhi = [];

        if (youXiZhuangTai.youXiMoShi === 'pve' && youXiZhuangTai.liShiBuZhou.length > 0) {
            const daoShuDiErBu = youXiZhuangTai.liShiBuZhou.pop();
            ChessRules.cheXiaoYiDong(
                youXiZhuangTai.qiPan,
                daoShuDiErBu.qiHang,
                daoShuDiErBu.qiLie,
                daoShuDiErBu.muBiaoHang,
                daoShuDiErBu.muBiaoLie,
                daoShuDiErBu.beiChiQiZi
            );
            youXiZhuangTai.dangQianFang = daoShuDiErBu.fang;
            youXiZhuangTai.buShu--;
        }

        gengXinJieMian();
    }

    /**
     * 保存游戏
     */
    function baoCunYouXi() {
        Storage.baoCunQiJu({
            qiPan: youXiZhuangTai.qiPan,
            dangQianFang: youXiZhuangTai.dangQianFang,
            buShu: youXiZhuangTai.buShu
        }).then(() => {
            xianShiMoTaiChuang('保存成功', '棋局已保存');
        }).catch((err) => {
            console.error('保存失败:', err);
            xianShiMoTaiChuang('保存失败', '请检查存储权限');
        });
    }

    /**
     * 加载游戏
     */
    function jiaZaiYouXi() {
        Storage.jiaZaiQiJu().then((shuJu) => {
            if (shuJu) {
                youXiZhuangTai.qiPan = shuJu.qiPan;
                youXiZhuangTai.dangQianFang = shuJu.dangQianFang;
                youXiZhuangTai.buShu = shuJu.buShu || 0;
                youXiZhuangTai.xuanZhongWeiZhi = null;
                youXiZhuangTai.keDongWeiZhi = [];
                youXiZhuangTai.liShiBuZhou = [];
                youXiZhuangTai.youXiJieShu = false;
                
                gengXinJieMian();
                xianShiMoTaiChuang('加载成功', '棋局已恢复');
            } else {
                xianShiMoTaiChuang('加载失败', '没有找到保存的棋局');
            }
        }).catch((err) => {
            console.error('加载失败:', err);
            xianShiMoTaiChuang('加载失败', '读取棋局数据出错');
        });
    }

    /**
     * 尝试加载保存的游戏
     */
    function jiaZaiBaoCunDeYouXi() {
        Storage.jiaZaiSheZhi().then((sheZhi) => {
            if (sheZhi) {
                if (typeof sheZhi.yinXiaoKaiQi !== 'undefined') {
                    youXiZhuangTai.yinXiaoKaiQi = sheZhi.yinXiaoKaiQi;
                }
                if (sheZhi.youXiMoShi) {
                    youXiZhuangTai.youXiMoShi = sheZhi.youXiMoShi;
                }
                if (sheZhi.aiNanDu) {
                    youXiZhuangTai.aiNanDu = sheZhi.aiNanDu;
                    ChessAI.sheZhiNanDu(youXiZhuangTai.aiNanDu);
                }
                gengXinYinXiaoAnNiu();
                gengXinMoShiAnNiu();
            }
        });
    }

    /**
     * 切换游戏模式
     */
    function qieHuanYouXiMoShi() {
        if (youXiZhuangTai.buShu > 0) {
            if (!confirm('切换模式将重新开始游戏，确定吗？')) {
                return;
            }
        }

        youXiZhuangTai.youXiMoShi = youXiZhuangTai.youXiMoShi === 'pvp' ? 'pve' : 'pvp';
        youXiZhuangTai.aiNanDu = 2;
        ChessAI.sheZhiNanDu(2);
        
        console.log('切换游戏模式:', youXiZhuangTai.youXiMoShi);

        Storage.baoCunSheZhi({ 
            youXiMoShi: youXiZhuangTai.youXiMoShi,
            aiNanDu: youXiZhuangTai.aiNanDu 
        });

        chongZhiYouXi();
    }

    /**
     * 设置AI难度
     */
    function sheZhiAiNanDu(nanDu) {
        youXiZhuangTai.aiNanDu = nanDu;
        ChessAI.sheZhiNanDu(nanDu);
        Storage.baoCunSheZhi({ aiNanDu: nanDu });
        gengXinMoShiAnNiu();
    }

    /**
     * 更新界面
     */
    function gengXinJieMian() {
        let jiangJunWeiZhi = null;
        if (!youXiZhuangTai.youXiJieShu && ChessRules.jianChaShiFouBeiJiangJun(youXiZhuangTai.qiPan, youXiZhuangTai.dangQianFang)) {
            jiangJunWeiZhi = ChessRules.chaZhaoJiangShuaiWeiZhi(youXiZhuangTai.qiPan, youXiZhuangTai.dangQianFang);
        }

        ChessUI.chongHuiQiPan(
            youXiZhuangTai.qiPan,
            youXiZhuangTai.xuanZhongWeiZhi,
            youXiZhuangTai.keDongWeiZhi,
            jiangJunWeiZhi
        );

        gengXinYouXiXinXi();
    }

    /**
     * 更新游戏信息显示
     */
    function gengXinYouXiXinXi() {
        const huiHeYuanSu = document.getElementById('current-turn');
        const buShuYuanSu = document.getElementById('step-count');

        if (huiHeYuanSu) {
            let wenBen = youXiZhuangTai.dangQianFang === ChessRules.HONG_FANG ? '红方' : '黑方';
            if (youXiZhuangTai.aiSiKaoZhong) {
                wenBen = 'AI思考中...';
            }
            huiHeYuanSu.textContent = wenBen;
            huiHeYuanSu.style.color = youXiZhuangTai.dangQianFang === ChessRules.HONG_FANG 
                ? '#ff6b6b' : '#4CAF50';
        }

        if (buShuYuanSu) {
            buShuYuanSu.textContent = `第 ${youXiZhuangTai.buShu} 步`;
        }
    }

    /**
     * 更新音效按钮状态
     */
    function gengXinYinXiaoAnNiu() {
        const yinXiaoAnNiu = document.getElementById('btn-sound');
        if (yinXiaoAnNiu) {
            yinXiaoAnNiu.textContent = `音效: ${youXiZhuangTai.yinXiaoKaiQi ? '开' : '关'}`;
            yinXiaoAnNiu.classList.toggle('active', youXiZhuangTai.yinXiaoKaiQi);
        }
    }

    /**
     * 更新模式按钮状态
     */
    function gengXinMoShiAnNiu() {
        const moShiAnNiu = document.getElementById('btn-mode');
        if (moShiAnNiu) {
            moShiAnNiu.textContent = youXiZhuangTai.youXiMoShi === 'pvp' ? '人人对战' : '人机对战';
        }

        const nanDuRongQi = document.getElementById('difficulty-panel');
        if (nanDuRongQi) {
            nanDuRongQi.style.display = youXiZhuangTai.youXiMoShi === 'pve' ? 'flex' : 'none';
            
            document.querySelectorAll('.diff-btn').forEach(btn => {
                btn.classList.toggle('active', parseInt(btn.dataset.level) === youXiZhuangTai.aiNanDu);
            });
        }
    }

    /**
     * 绑定控制按钮
     */
    function bangDingKongZhiAnNiu() {
        const huiQiAnNiu = document.getElementById('btn-undo');
        const baoCunAnNiu = document.getElementById('btn-save');
        const jiaZaiAnNiu = document.getElementById('btn-load');
        const chongKaiAnNiu = document.getElementById('btn-restart');
        const yinXiaoAnNiu = document.getElementById('btn-sound');
        const moShiAnNiu = document.getElementById('btn-mode');
        const queRenAnNiu = document.getElementById('modal-confirm');

        if (huiQiAnNiu) huiQiAnNiu.addEventListener('click', zhiXingHuiQi);
        if (baoCunAnNiu) baoCunAnNiu.addEventListener('click', baoCunYouXi);
        if (jiaZaiAnNiu) jiaZaiAnNiu.addEventListener('click', jiaZaiYouXi);

        if (chongKaiAnNiu) {
            chongKaiAnNiu.addEventListener('click', () => {
                if (youXiZhuangTai.buShu > 0) {
                    if (confirm('确定要重新开始吗？')) chongZhiYouXi();
                } else {
                    chongZhiYouXi();
                }
            });
        }

        if (yinXiaoAnNiu) {
            yinXiaoAnNiu.addEventListener('click', () => {
                const kaiQi = YinXiaoGuanLi.qieHuanKaiGuan();
                youXiZhuangTai.yinXiaoKaiQi = kaiQi;
                gengXinYinXiaoAnNiu();
                Storage.baoCunSheZhi({ yinXiaoKaiQi: kaiQi });
            });
        }

        if (moShiAnNiu) {
            moShiAnNiu.addEventListener('click', qieHuanYouXiMoShi);
        }

        if (queRenAnNiu) {
            queRenAnNiu.addEventListener('click', yinCangMoTaiChuang);
        }

        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                sheZhiAiNanDu(parseInt(btn.dataset.level));
            });
        });
    }

    /**
     * 绑定窗口事件
     */
    function bangDingChuangKouShiJian() {
        window.addEventListener('resize', () => {
            ChessUI.jiSuanZuiJiaChiCun();
            ChessUI.chongHuiQiPan(
                youXiZhuangTai.qiPan,
                youXiZhuangTai.xuanZhongWeiZhi,
                youXiZhuangTai.keDongWeiZhi,
                null
            );
        });

        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                ChessUI.jiSuanZuiJiaChiCun();
                ChessUI.chongHuiQiPan(
                    youXiZhuangTai.qiPan,
                    youXiZhuangTai.xuanZhongWeiZhi,
                    youXiZhuangTai.keDongWeiZhi,
                    null
                );
            }, 100);
        });

        document.addEventListener('deviceready', () => {
            console.log('Cordova 设备就绪');
            Storage.chuShiHua();
        }, false);
    }

    /**
     * 显示模态窗口
     */
    function xianShiMoTaiChuang(biaoTi, xiaoXi) {
        const zheZhaoCeng = document.getElementById('modal-overlay');
        const biaoTiYuanSu = document.getElementById('modal-title');
        const xiaoXiYuanSu = document.getElementById('modal-message');

        if (biaoTiYuanSu) biaoTiYuanSu.textContent = biaoTi;
        if (xiaoXiYuanSu) xiaoXiYuanSu.textContent = xiaoXi;
        if (zheZhaoCeng) zheZhaoCeng.classList.remove('hidden');
    }

    /**
     * 隐藏模态窗口
     */
    function yinCangMoTaiChuang() {
        const zheZhaoCeng = document.getElementById('modal-overlay');
        if (zheZhaoCeng) zheZhaoCeng.classList.add('hidden');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', chuShiHuaYouXi);
    } else {
        chuShiHuaYouXi();
    }
})();
