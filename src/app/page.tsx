"use client";

import { motion } from "framer-motion";
import { MapPin, Star, Users, TrendingUp, Heart, Gift } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full z-50 glass-effect"
      >
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            className="text-2xl font-bold gradient-text"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            🎯 DollCatcher
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            앱 다운로드
          </motion.button>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pt-32 pb-20 px-6"
      >
        <div className="container mx-auto text-center">
          <motion.div variants={itemVariants} className="mb-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-8xl mb-6"
            >
              🧸
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text">인형뽑기</span>
              <br />
              <span className="text-gray-800">매장을 찾아보세요</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              내 주변 인형뽑기 매장을 쉽고 빠르게 찾아보세요.
              <br />
              실시간 정보와 후기로 완벽한 인형뽑기 경험을 만들어드립니다.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(221, 69, 241, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold flex items-center gap-2 shadow-xl hover:bg-primary-600 transition-all duration-300"
            >
              <Gift size={20} />앱 다운로드
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-primary text-primary px-8 py-4 rounded-full text-lg font-semibold flex items-center gap-2 hover:bg-primary hover:text-white transition-all duration-300"
            >
              매장 등록하기
              <TrendingUp size={20} />
            </motion.button>
          </motion.div>

          {/* Floating elements */}
          <div className="relative">
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -left-10 text-4xl opacity-70"
            >
              🎪
            </motion.div>
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -top-5 -right-10 text-3xl opacity-70"
            >
              🎮
            </motion.div>
            <motion.div
              animate={{ y: [0, -25, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              className="absolute top-20 left-20 text-2xl opacity-60"
            >
              ✨
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-6"
      >
        <div className="container mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">왜 DollCatcher일까요?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              MZ세대를 위한 트렌디하고 편리한 인형뽑기 매장 찾기 서비스
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <MapPin className="w-12 h-12" />,
                title: "정확한 위치 정보",
                description:
                  "지도 기반으로 내 주변 인형뽑기 매장을 정확하게 찾아보세요.",
                color: "from-pink-400 to-purple-600",
              },
              {
                icon: <Star className="w-12 h-12" />,
                title: "실시간 후기",
                description:
                  "다른 유저들의 생생한 후기와 평점을 확인하고 최고의 매장을 선택하세요.",
                color: "from-purple-400 to-indigo-600",
              },
              {
                icon: <Users className="w-12 h-12" />,
                title: "커뮤니티",
                description:
                  "인형뽑기를 사랑하는 사람들과 정보를 공유하고 소통해보세요.",
                color: "from-indigo-400 to-pink-600",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 },
                }}
                className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 mx-auto`}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-6 gradient-bg"
      >
        <div className="container mx-auto text-center">
          <div className="grid md:grid-cols-3 gap-8 text-white">
            {[
              { number: "1,000+", label: "등록된 매장" },
              { number: "10,000+", label: "활성 사용자" },
              { number: "50,000+", label: "작성된 후기" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1, delay: index * 0.3 }}
                  className="text-5xl md:text-6xl font-bold mb-2"
                >
                  {stat.number}
                </motion.div>
                <div className="text-xl opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-pink-600" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            지금 시작해보세요! 💖
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
          >
            전국 최고의 인형뽑기 매장들을 발견하고, 나만의 특별한 순간을
            만들어보세요
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/map">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-primary rounded-full font-bold text-lg shadow-2xl hover:shadow-white/25 transition-all duration-300 flex items-center gap-2 group"
              >
                <MapPin className="group-hover:animate-bounce" size={24} />
                지도에서 찾기
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300 flex items-center gap-2 group"
            >
              <Heart className="group-hover:animate-pulse" size={24} />찜 목록
              보기
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="text-3xl font-bold gradient-text mb-4">
              🎯 DollCatcher
            </div>
            <p className="text-gray-400 max-w-md mx-auto">
              인형뽑기를 사랑하는 모든 사람들을 위한 최고의 매장 찾기 서비스
            </p>
          </motion.div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-500">
              © 2024 DollCatcher. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
